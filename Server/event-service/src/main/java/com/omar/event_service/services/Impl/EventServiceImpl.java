package com.omar.event_service.services.Impl;

import com.omar.event_service.client.artist.ArtistClient;


import com.omar.event_service.client.artist.DisplayCardArtistDTO;
import com.omar.event_service.dto.common.EventVideoDTO;
import com.omar.event_service.dto.request.EventRequest;
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
    public Page<DisplayCardEventDTO> getEventsByArtist(Long artistId, Pageable pageable) {
        validateArtistExists(artistId);
        Page<Event> events= eventRepository.findByArtistIdsContaining(artistId, pageable);
        return mapEventsToDisplayCards(events);
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











}
