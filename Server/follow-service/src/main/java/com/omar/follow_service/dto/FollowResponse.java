package com.omar.follow_service.dto;

import com.omar.follow_service.client.artist.ArtistDTO;

public record FollowResponse(
        String userId,
        Long artistId,
        ArtistDTO artistDetails
) {
}
