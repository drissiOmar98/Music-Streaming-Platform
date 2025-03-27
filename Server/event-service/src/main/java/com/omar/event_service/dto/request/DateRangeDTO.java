package com.omar.event_service.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record DateRangeDTO(
        @NotNull(message = "Start date/time is required")
        @FutureOrPresent(message = "Start date/time must be in present or future")
        LocalDateTime startDateTime,

        @Future(message = "End date/time must be in the future")
        LocalDateTime endDateTime
) {
    public boolean isValidRange() {
        return endDateTime.isAfter(startDateTime);
    }
}
