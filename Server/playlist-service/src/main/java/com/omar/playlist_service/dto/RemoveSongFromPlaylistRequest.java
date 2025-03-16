package com.omar.playlist_service.dto;

public record RemoveSongFromPlaylistRequest(
        Long playlistId,
        Long songId
) {
}
