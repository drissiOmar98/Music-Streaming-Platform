package com.omar.event_participation_service.dto;

import com.omar.event_participation_service.client.event.EventDTO;

public record EventParticipationResponse(
        String userId,
        Long eventId,
        EventDTO eventDetails
) {
}
