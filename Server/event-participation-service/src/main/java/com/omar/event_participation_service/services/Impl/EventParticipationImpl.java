package com.omar.event_participation_service.services.Impl;

import com.omar.event_participation_service.client.event.EventClient;
import com.omar.event_participation_service.client.event.EventDTO;
import com.omar.event_participation_service.dto.EventParticiaptionRequest;
import com.omar.event_participation_service.dto.EventParticipationResponse;
import com.omar.event_participation_service.exception.EventAlreadyParticaptiException;
import com.omar.event_participation_service.exception.EventNotFoundException;
import com.omar.event_participation_service.exception.EventParticipationNotFoundException;
import com.omar.event_participation_service.mapper.EventParticipationMapper;
import com.omar.event_participation_service.model.EventParticipation;
import com.omar.event_participation_service.repository.EventParticipationRepository;
import com.omar.event_participation_service.services.EventParticipationService;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventParticipationImpl implements EventParticipationService {


    private final EventParticipationMapper eventParticipationMapper;

    private final EventParticipationRepository eventParticipationRepository;

    private final EventClient eventClient;

    public EventParticipationImpl(EventParticipationMapper eventParticipationMapper, EventParticipationRepository eventParticipationRepository, EventClient eventClient) {
        this.eventParticipationMapper = eventParticipationMapper;
        this.eventParticipationRepository = eventParticipationRepository;
        this.eventClient = eventClient;
    }

    private static final String EVENT_NOT_FOUND = "Event with ID %s does not exist.";
    private static final String ALREADY_PARTICIPATING = "User is already participating in event with ID %s";
    private static final String PARTICIPATION_NOT_FOUND = "Participation record not found for user %s and event %s";
    private static final String NO_PARTICIPATION_FOUND = "No event participations found for user %s";


    @Override
    public void joinEvent(EventParticiaptionRequest request, Authentication authentication) {
        String userId = getAuthenticatedUserId(authentication);
        validateEventExists(request.eventId());
        validateUserNotAlreadyParticipating(userId, request.eventId());
        EventParticipation eventParticipation = eventParticipationMapper.toEntity(request, userId);
        eventParticipationRepository.save(eventParticipation);
    }

    @Override
    public void leaveEvent(Long eventId, Authentication authentication) {
        String userId = getAuthenticatedUserId(authentication);
        EventParticipation participation = getParticipationOrThrow(userId, eventId);
        eventParticipationRepository.delete(participation);
    }

    @Override
    public List<EventParticipationResponse> getJoinedEvents(Authentication authentication) {
        String userId = getAuthenticatedUserId(authentication);

        List<EventParticipation> joinedEvents = eventParticipationRepository.findByUserId(userId);

        return joinedEvents.stream()
                .map(participation -> {
                    // Fetch event details for each participation
                    EventDTO eventDetails = eventClient.getEventDetailsById(participation.getEventId());
                    return eventParticipationMapper.toParticipationResponse(participation, eventDetails);
                })
                .collect(Collectors.toList());
    }


    @Override
    public boolean isParticipating(Long eventId, Authentication authentication) {
        String userId = getAuthenticatedUserId(authentication);
        validateEventExists(eventId);
        return eventParticipationRepository.existsByUserIdAndEventId(userId, eventId);
    }

    @Override
    public void clearParticipations(Authentication authentication) {
        String userId = getAuthenticatedUserId(authentication);
        List<EventParticipation> joinedEvents = getUserParticipationOrThrow(userId);
        eventParticipationRepository.deleteAll(joinedEvents);
    }

    private String getAuthenticatedUserId(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        return jwt.getSubject();
    }


    private void validateEventExists(Long eventId) {
        try {
            eventClient.getEventDetailsById(eventId);
        } catch (Exception e) {
            throw new EventNotFoundException(String.format(EVENT_NOT_FOUND, eventId));
        }
    }

    private void validateUserNotAlreadyParticipating(String userId, Long eventId) {
        if (eventParticipationRepository.existsByUserIdAndEventId(userId, eventId)) {
            throw new EventAlreadyParticaptiException(String.format(ALREADY_PARTICIPATING, eventId));
        }
    }
    private EventParticipation getParticipationOrThrow(String userId, Long eventId) {
        return eventParticipationRepository.findByUserIdAndEventId(userId, eventId)
                .orElseThrow(() -> new EventNotFoundException(
                        String.format(PARTICIPATION_NOT_FOUND, userId, eventId)
                ));
    }

    private List<EventParticipation> getUserParticipationOrThrow(String userId) {
        List<EventParticipation> joinedEvents = eventParticipationRepository.findByUserId(userId);
        if (joinedEvents.isEmpty()) {
            throw new EventParticipationNotFoundException(String.format(NO_PARTICIPATION_FOUND, userId));
        }
        return joinedEvents;
    }
}
