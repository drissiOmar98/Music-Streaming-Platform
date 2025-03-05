package com.omar.favorites_service.dto;

import jakarta.validation.constraints.NotNull;

public record FavouriteRequest(
        @NotNull(message = "Song ID  is required")
        Long songId
) {
}
