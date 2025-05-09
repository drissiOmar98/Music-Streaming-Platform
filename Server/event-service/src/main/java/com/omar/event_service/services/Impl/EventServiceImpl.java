package com.omar.event_service.services.Impl;

import com.omar.event_service.client.artist.ArtistClient;


import com.omar.event_service.client.artist.DisplayCardArtistDTO;
import com.omar.event_service.dto.common.EventVideoDTO;
import com.omar.event_service.dto.request.EventRequest;
import com.omar.event_service.dto.request.UpdateEventArtistsRequest;
import com.omar.event_service.dto.response.DisplayCardEventDTO;
import com.omar.event_service.dto.response.DisplayEventDTO;
import com.omar.event_service.exception.ArtistNotFoundException;
import com.omar.event_service.exception.EventNotFoundException;
import com.omar.event_service.mapper.EventMapper;
import com.omar.event_service.mapper.EventVideoMapper;
import com.omar.event_service.model.Event;
import com.omar.event_service.model.EventVideo;
import com.omar.event_service.repository.EventRepository;
import com.omar.event_service.repository.EventVideoRepository;
import com.omar.event_service.services.EventService;
import com.omar.event_service.services.PictureService;
import com.omar.event_service.shared.state.State;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;

    private final EventVideoRepository eventVideoRepository;

    private final EventMapper eventMapper;

    private final PictureService pictureService;

    private final ArtistClient artistClient;

    private final EventVideoMapper eventVideoMapper;


    public EventServiceImpl(EventRepository eventRepository, EventVideoRepository eventVideoRepository, EventMapper eventMapper, PictureService pictureService, ArtistClient artistClient, EventVideoMapper eventVideoMapper) {
        this.eventRepository = eventRepository;
        this.eventVideoRepository = eventVideoRepository;
        this.eventMapper = eventMapper;
        this.pictureService = pictureService;
        this.artistClient = artistClient;
        this.eventVideoMapper = eventVideoMapper;
    }

    private static final String ARTIST_NOT_FOUND = "Artist not found with ID: ";
    private static final String EVENT_NOT_FOUND = "Event not found with ID: ";


    @Override
    @Transactional
    public Long createEvent(EventRequest request) {
        // Validate artist IDs before processing
        validateArtistIds(request.artistIds());

        Event event = eventMapper.toEntity(request);
        Event savedEvent = eventRepository.save(event);

        // Process pictures if present
        if (request.pictures() != null && !request.pictures().isEmpty()) {
            pictureService.saveAll(request.pictures(), savedEvent);
        }

        // Process video if present
        if (request.video() != null) {
            EventVideo eventVideo = eventVideoMapper.saveVideoToEvent(request);
            eventVideo.setEvent(savedEvent);
            eventVideoRepository.save(eventVideo);
        }

        return savedEvent.getId();
    }

    @Override
    public Page<DisplayCardEventDTO> getAllEvents(Pageable pageable) {
        Page<Event> events = eventRepository.findAllWithCoverOnly(pageable);
        return mapEventsToDisplayCards(events);
    }

    @Override
    public DisplayCardEventDTO getEventDetailsWithCover(Long eventId) {
        Event event = eventRepository.findEventWithCoverOnly(eventId)
                .orElseThrow(() -> new EventNotFoundException(EVENT_NOT_FOUND + eventId));

        Set<DisplayCardArtistDTO> artists = fetchArtistsForEvent(event);
        return eventMapper.eventToDisplayCardEventDTO(event, artists);
    }

    @Override
    public Page<DisplayCardEventDTO> getEventsByArtist(Long artistId, Pageable pageable) {
        validateArtistExists(artistId);
        Page<Event> events= eventRepository.findByArtistIdsContaining(artistId, pageable);
        return mapEventsToDisplayCards(events);
    }

    @Override
    public Page<DisplayCardEventDTO> getUpcomingEvents(Pageable pageable) {
        Date currentDate = new Date();
        Page<Event> eventPage = eventRepository.findUpcomingEventsWithCover(currentDate, pageable);
        return mapEventsToDisplayCards(eventPage);
    }

    @Override
    public Page<DisplayCardEventDTO> getPastEvents(Pageable pageable) {
        Date currentDate = new Date();
        Page<Event> eventPage = eventRepository.findPastEventsWithCover(currentDate, pageable);
        return mapEventsToDisplayCards(eventPage);
    }


    @Override
    public State<DisplayEventDTO, String> getEventById(Long eventId) {
        Event event = getEventOrThrow(eventId);
        Set<DisplayCardArtistDTO> artists = fetchArtistsForEvent(event);
        DisplayEventDTO displayEventDTO = eventMapper.eventToDisplayEventDTO(event, artists);
        return State.<DisplayEventDTO, String>builder().forSuccess(displayEventDTO);
    }

    @Override
    public Optional<EventVideoDTO> getEventContentById(Long eventId) {
        getEventOrThrow(eventId);
        return eventVideoRepository.findById(eventId)
                .map(eventVideoMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DisplayCardEventDTO> searchEvents(Pageable pageable, String query) {
        Page<Event> events= eventRepository.searchEvents(query,pageable);
        return mapEventsToDisplayCards(events);
    }



    @Override
    public boolean existsById(Long eventId) {
        return eventRepository.findById(eventId).isPresent();
    }

    @Override
    public boolean isArtistInEvent(Long eventId, Long artistId) {
        Event event = getEventOrThrow(eventId);
        return event.getArtistIds().contains(artistId);
    }

    @Override
    public void addArtistsToEvent(UpdateEventArtistsRequest request) {
        validateArtistIds(request.artistIds());
        Event event = getEventOrThrow(request.eventId());
        event.getArtistIds().addAll(request.artistIds());
        eventRepository.save(event);
    }

    @Override
    public void removeArtistsFromEvent(UpdateEventArtistsRequest request ) {
        validateArtistIds(request.artistIds());
        Event event = getEventOrThrow(request.eventId());
        event.getArtistIds().removeAll(request.artistIds());
        eventRepository.save(event);
    }

    @Override
    public void deleteEvent(Long eventId) {
        Event event = getEventOrThrow(eventId);
        eventRepository.deleteById(event.getId());
    }

    @Override
    @Transactional
    public Long updateEvent(Long eventId, EventRequest request) {
        Event existingEvent = getEventOrThrow(eventId);

        // Update basic fields
        existingEvent.setTitle(request.infos().title());
        existingEvent.setDescription(request.infos().description());
        existingEvent.setLocation(request.location());
        existingEvent.setStartDateTime(eventMapper.parseDate(request.dateRange().startDateTime()));
        existingEvent.setEndDateTime(eventMapper.parseDate(request.dateRange().endDateTime()));

        // Update pictures if provided
        if (request.pictures() != null && !request.pictures().isEmpty()) {
            pictureService.updatePictures(existingEvent, request.pictures());
        }

        // Update video if provided - using mapper approach
        if (request.video() != null) {
            updateEventVideo(existingEvent, request);
        }

        // Update artists if needed
        if (!existingEvent.getArtistIds().equals(request.artistIds())) {
            validateArtistIds(request.artistIds());
            existingEvent.setArtistIds(request.artistIds());
        }

        Event updatedEvent = eventRepository.save(existingEvent);
        return updatedEvent.getId();
    }


    private Event getEventOrThrow(Long eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new EventNotFoundException(
                        EVENT_NOT_FOUND + eventId
                        )
                );
    }


    private void validateArtistIds(Set<Long> artistIds) {
        artistIds.forEach(this::validateArtistExists);
    }

    private void validateArtistExists(Long artistId) {
        try {
            artistClient.getArtistDetailsById(artistId);
        } catch (Exception e) {
            throw new ArtistNotFoundException(ARTIST_NOT_FOUND + artistId);
        }
    }

    private Set<DisplayCardArtistDTO> fetchArtistsForEvent(Event event) {
        return event.getArtistIds().stream()
                .map(artistClient::getArtistDetailsById)
                .collect(Collectors.toSet());
    }

    private Page<DisplayCardEventDTO> mapEventsToDisplayCards(Page<Event> eventPage) {
        if (eventPage.isEmpty()) {
            return Page.empty(eventPage.getPageable());
        }

        Set<Long> allArtistIds = eventPage.getContent().stream()
                .flatMap(event -> event.getArtistIds().stream())
                .collect(Collectors.toSet());

        Map<Long, DisplayCardArtistDTO> artistsMap = allArtistIds.stream()
                .collect(Collectors.toMap(
                        id -> id,
                        artistClient::getArtistDetailsById
                ));

        List<DisplayCardEventDTO> content = eventPage.getContent().stream()
                .map(event -> {
                    Set<DisplayCardArtistDTO> eventArtists = event.getArtistIds().stream()
                            .map(artistsMap::get)
                            .collect(Collectors.toSet());
                    return eventMapper.eventToDisplayCardEventDTO(event, eventArtists);
                })
                .toList();

        return new PageImpl<>(content, eventPage.getPageable(), eventPage.getTotalElements());
    }




    private void updateEventVideo(Event event, EventRequest request) {
        Optional<EventVideo> existingVideo = eventVideoRepository.findByEventId(event.getId());
        if (existingVideo.isPresent()) {
            EventVideo video = existingVideo.get();
            eventVideoMapper.updateVideoFromRequest(request, video);
            eventVideoRepository.save(video);
        } else {
            EventVideo newVideo = eventVideoMapper.saveVideoToEvent(request);
            newVideo.setEvent(event);
            eventVideoRepository.save(newVideo);
        }
    }






}
