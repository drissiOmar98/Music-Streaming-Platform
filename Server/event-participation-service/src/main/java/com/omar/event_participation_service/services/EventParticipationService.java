package com.omar.event_participation_service.services;

import com.omar.event_participation_service.dto.EventParticiaptionRequest;
import com.omar.event_participation_service.dto.EventParticipationResponse;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface EventParticipationService {

    void joinEvent(EventParticiaptionRequest request, Authentication authentication);

    void leaveEvent(Long eventId, Authentication authentication);

    List<EventParticipationResponse> getJoinedEvents(Authentication authentication);

    boolean isParticipating(Long eventId, Authentication authentication);

    void clearParticipations(Authentication authentication);
}
