package com.omar.playlist_service.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.Arrays;
import java.util.Collections;
import java.util.Objects;
import java.util.Set;

public record PlaylistRequest(
        @NotBlank(message = "Title is required")
        String title,
        String description,
        byte[] cover,
        String coverContentType,
        Set<Long> songIds // Optional list of song IDs (default to empty set)
) {
    public PlaylistRequest {
        if (songIds == null) {
            songIds = Collections.emptySet(); // Default to empty set if null
        }
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        PlaylistRequest that = (PlaylistRequest) obj;
        return Objects.equals(title, that.title) &&
                Objects.equals(description, that.description) &&
                Arrays.equals(cover, that.cover) &&
                Objects.equals(coverContentType, that.coverContentType) &&
                Objects.equals(songIds, that.songIds);
    }

    @Override
    public int hashCode() {
        int result = Objects.hash(title, description, coverContentType, songIds);
        result = 31 * result + Arrays.hashCode(cover);
        return result;
    }

    @Override
    public String toString() {
        return "PlaylistRequest{" +
                "title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", cover=" + (cover != null ? "byte[" + cover.length + "]" : "null") +
                ", coverContentType='" + coverContentType + '\'' +
                ", songIds=" + songIds +
                '}';
    }
}
