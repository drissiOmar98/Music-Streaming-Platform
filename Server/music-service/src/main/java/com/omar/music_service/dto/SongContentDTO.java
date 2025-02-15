package com.omar.music_service.dto;

import jakarta.persistence.Lob;

import java.util.Arrays;

public record SongContentDTO(
        Long songId,
        @Lob byte[] file,
        String fileContentType
) {

        @Override
        public boolean equals(Object obj) {
                if (this == obj) return true;
                if (obj == null || getClass() != obj.getClass()) return false;
                SongContentDTO that = (SongContentDTO) obj;
                return songId.equals(that.songId) &&
                        Arrays.equals(file, that.file) &&
                        fileContentType.equals(that.fileContentType);
        }

        @Override
        public int hashCode() {
                int result = songId.hashCode();
                result = 31 * result + Arrays.hashCode(file);
                result = 31 * result + (fileContentType != null ? fileContentType.hashCode() : 0);
                return result;
        }

        @Override
        public String toString() {
                return "SongContentDTO{" +
                        "songId=" + songId +
                        ", file=" + (file != null ? "byte[" + file.length + "]" : "null") +
                        ", fileContentType='" + fileContentType + '\'' +
                        '}';
        }
}
