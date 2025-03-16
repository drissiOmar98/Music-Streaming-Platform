package com.omar.playlist_service.dto;

public record AddSongToPlaylistRequest(
        Long playlistId,
        Long songId
) {
}
