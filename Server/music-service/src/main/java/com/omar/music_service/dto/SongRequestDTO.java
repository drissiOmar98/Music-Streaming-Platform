package com.omar.music_service.dto;

import com.omar.music_service.entities.Genre;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Arrays;

public record SongRequestDTO(

        @NotBlank(message = "Title cannot be empty")
        String title,

        @NotNull(message = "Artist ID cannot be null")
        Long artistId,

        @NotNull(message = "Cover image cannot be null")
        byte[] cover,

        @NotBlank(message = "Cover content type cannot be empty")
        String coverContentType,

        @NotNull byte[] file,

        @NotNull String fileContentType,

        @NotNull(message = "Genre cannot be null")
        Genre genre
) {
        @Override
        public boolean equals(Object obj) {
                if (this == obj) return true;
                if (obj == null || getClass() != obj.getClass()) return false;
                SongRequestDTO that = (SongRequestDTO) obj;
                return title.equals(that.title) &&
                        artistId.equals(that.artistId) &&
                        Arrays.equals(cover, that.cover) &&
                        coverContentType.equals(that.coverContentType) &&
                        Arrays.equals(file, that.file) &&
                        fileContentType.equals(that.fileContentType) &&
                        genre == that.genre;
        }

        @Override
        public int hashCode() {
                int result = title.hashCode();
                result = 31 * result + artistId.hashCode();
                result = 31 * result + Arrays.hashCode(cover);
                result = 31 * result + coverContentType.hashCode();
                result = 31 * result + Arrays.hashCode(file);
                result = 31 * result + fileContentType.hashCode();
                result = 31 * result + genre.hashCode();
                return result;
        }

        @Override
        public String toString() {
                return "SaveSongDTO{" +
                        "title='" + title + '\'' +
                        ", artistId=" + artistId +
                        ", cover=" + (cover != null ? "byte[" + cover.length + "]" : "null") +
                        ", coverContentType='" + coverContentType + '\'' +
                        ", file=" + (file != null ? "byte[" + file.length + "]" : "null") +
                        ", fileContentType='" + fileContentType + '\'' +
                        ", genre=" + genre +
                        '}';
        }
}
