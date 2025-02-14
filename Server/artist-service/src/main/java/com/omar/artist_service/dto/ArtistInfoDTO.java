package com.omar.artist_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ArtistInfoDTO(

        @NotBlank(message = "Name cannot be blank")
        String name,

        @NotNull(message = "Artist Bio is required")
        String bio
) {
}
