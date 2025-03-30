package com.omar.event_service.dto.request;

import com.omar.event_service.dto.common.EventVideoDTO;
import com.omar.event_service.dto.common.PictureDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;
import java.util.Set;

public record EventRequest(

        @NotNull(message = "Event info is required")
        @Valid
        EventInfoDTO infos,

        @NotEmpty
        @Size(max = 100, message = "Location must be less than 100 characters")
        String location,

        @NotNull(message = "Date range is required")
        @Valid
        DateRangeDTO dateRange,

        @Size(max = 5, message = "Maximum 5 pictures allowed")
        List<@Valid PictureDTO> pictures,

        @Valid
        EventVideoDTO video,

        @NotEmpty(message = "At least one artist is required")
        Set<@NotNull(message = "Artist ID cannot be null") Long> artistIds
) {
}
