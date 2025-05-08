package com.omar.event_participation_service.dto;

import jakarta.validation.constraints.NotNull;

public record EventParticiaptionRequest(
        @NotNull(message = "Event ID is required")
        Long eventId
) {
}
