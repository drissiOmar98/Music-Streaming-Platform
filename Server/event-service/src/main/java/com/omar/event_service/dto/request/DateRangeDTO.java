package com.omar.event_service.dto.request;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;


import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public record DateRangeDTO(
        @NotNull(message = "Start date/time is required")
        String startDateTime,  // Keep String

        @NotNull(message = "End date/time is required")
        String endDateTime     // Keep String
) {
    private static final SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    @AssertTrue(message = "End date must be after start date")
    public boolean isValidRange() {
        try {
            Date start = format.parse(startDateTime);
            Date end = format.parse(endDateTime);
            return end.after(start);
        } catch (ParseException e) {
            return false;
        }
    }

    @AssertTrue(message = "Start date cannot be in the past")
    public boolean isStartDateValid() {
        try {
            Date start = format.parse(startDateTime);
            return !start.before(new Date());
        } catch (ParseException e) {
            return false;
        }
    }
}
