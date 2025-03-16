package com.omar.playlist_service.dto;

import com.omar.playlist_service.client.song.ReadSongInfoDTO;
import jakarta.persistence.Lob;

import java.util.Arrays;
import java.util.Objects;
import java.util.Set;

public record PlaylistResponse(
        Long id,
        String title,
        String description,
        @Lob byte[] cover,
        String coverContentType,
        Set<ReadSongInfoDTO> songs // List of songs in the playlist
) {
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        PlaylistResponse that = (PlaylistResponse) obj;
        return Objects.equals(id, that.id) &&
                Objects.equals(title, that.title) &&
                Objects.equals(description, that.description) &&
                Arrays.equals(cover, that.cover) &&
                Objects.equals(coverContentType, that.coverContentType) &&
                Objects.equals(songs, that.songs);
    }

    @Override
    public int hashCode() {
        int result = Objects.hash(id, title, description, coverContentType, songs);
        result = 31 * result + Arrays.hashCode(cover);
        return result;
    }

    @Override
    public String toString() {
        return "PlaylistResponse{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", cover=" + (cover != null ? "byte[" + cover.length + "]" : "null") +
                ", coverContentType='" + coverContentType + '\'' +
                ", songs=" + songs +
                '}';
    }
}
