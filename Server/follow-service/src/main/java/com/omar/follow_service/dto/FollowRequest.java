package com.omar.follow_service.dto;

import jakarta.validation.constraints.NotNull;

public record FollowRequest(
        @NotNull(message = "Artist ID is required")
        Long artistId
) {
}
