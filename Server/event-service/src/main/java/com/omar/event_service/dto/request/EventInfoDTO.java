package com.omar.event_service.dto.request;

import jakarta.validation.constraints.NotBlank;

public record EventInfoDTO(

        @NotBlank(message = "Title cannot be blank")
        String title,

        String description
) {
}
