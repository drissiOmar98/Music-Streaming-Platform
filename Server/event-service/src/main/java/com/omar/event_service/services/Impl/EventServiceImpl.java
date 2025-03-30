package com.omar.event_service.services.Impl;

import com.omar.event_service.client.artist.ArtistClient;

import com.omar.event_service.dto.common.EventVideoDTO;
import com.omar.event_service.dto.request.DateRangeDTO;
import com.omar.event_service.dto.request.EventRequest;
import com.omar.event_service.exception.ArtistNotFoundException;
import com.omar.event_service.exception.InvalidEventDataException;
import com.omar.event_service.mapper.EventMapper;
import com.omar.event_service.mapper.EventVideoMapper;
import com.omar.event_service.model.Event;
import com.omar.event_service.model.EventVideo;
import com.omar.event_service.repository.EventRepository;
import com.omar.event_service.repository.EventVideoRepository;
import com.omar.event_service.services.EventService;
import com.omar.event_service.services.PictureService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Set;

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


    private void validateArtistIds(Set<Long> artistIds) {
        for (Long artistId : artistIds) {
            try {
                artistClient.getArtistDetailsById(artistId);
            } catch (Exception e) {
                throw new ArtistNotFoundException("Artist not found with ID: " + artistId);
            }
        }
    }









}
