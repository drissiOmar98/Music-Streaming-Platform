package com.omar.event_service.dto.common;


import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Null;
import jakarta.validation.constraints.Pattern;
import org.hibernate.validator.constraints.URL;

import java.util.Arrays;
import java.util.Objects;

public record EventVideoDTO(
        Long eventId,

        @Null(message = "File must be null when using URL")
        @AssertTrue(message = "Either file or URL must be provided")
        byte[] file,

        @Null(message = "Content type must be null when using URL")
        @Pattern(regexp = "video/(mp4|webm|quicktime)",
                message = "Invalid video type. Allowed: mp4, webm, quicktime")
        String fileContentType,

        @Null(message = "URL must be null when uploading file")
        @URL(message = "Invalid YouTube URL format")
        @Pattern(regexp = "^(https?://)?(www\\.)?(youtube\\.com|youtu\\.?be)/.+$",
                message = "Must be a YouTube URL")
        String videoUrl


) {

    @AssertTrue(message = "Either file or URL must be provided")
    public boolean isFileOrUrlPresent() {
        return (file != null && fileContentType != null) ^ (videoUrl != null);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        EventVideoDTO that = (EventVideoDTO) o;
        return Arrays.equals(file, that.file) &&
                Objects.equals(fileContentType, that.fileContentType);
    }

    @Override
    public int hashCode() {
        int result = Objects.hash(fileContentType);
        result = 31 * result + Arrays.hashCode(file);
        return result;
    }

    @Override
    public String toString() {
        return "EventVideoDTO{" +
                "file=" + Arrays.toString(file) +
                ", fileContentType='" + fileContentType + '\'' +
                '}';
    }
}
