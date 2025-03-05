package com.omar.favorites_service.dto;

import com.omar.favorites_service.client.song.ReadSongInfoDTO;

public record FavouriteResponse(
        String userId,
        Long songId,
        ReadSongInfoDTO songDetails // Contains song details

) {
}
