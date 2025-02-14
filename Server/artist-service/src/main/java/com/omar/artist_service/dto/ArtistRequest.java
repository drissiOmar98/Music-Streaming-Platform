package com.omar.artist_service.dto;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public record ArtistRequest(
        Long id,
        @NotNull(message = "Artist info is required")
        ArtistInfoDTO infos,
        List<PictureDTO> pictures
) {
}
