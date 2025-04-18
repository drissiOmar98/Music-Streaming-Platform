package com.omar.event_service.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record UpdateEventArtistsRequest(
        @NotNull(message = "Event ID cannot be null")
        Long eventId,

        @NotEmpty(message = "Artist IDs cannot be empty")
        @Size(max = 50, message = "Cannot modify more than 50 artists at once")
        Set<@NotNull(message = "Artist ID cannot be null") Long> artistIds
) {
}
