package com.omar.event_service.dto.common;


import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Pattern;
import org.hibernate.validator.constraints.URL;

import java.util.Arrays;
import java.util.Objects;

public record EventVideoDTO(
        Long eventId,


        byte[] file,

        @Pattern(regexp = "video/(mp4|webm|quicktime)",
                message = "Invalid video type. Allowed: mp4, webm, quicktime")
        String fileContentType,


        @URL(message = "Invalid YouTube URL format")
        @Pattern(regexp = "^(https?://)?(www\\.)?(youtube\\.com|youtu\\.?be)/.+$",
                message = "Must be a YouTube URL")
        String videoUrl
) {

    // Validation for file or URL
    @AssertTrue(message = "Either file or videoUrl must be provided, but not both")
    public boolean isFileOrUrl() {
        return (file != null && videoUrl == null) ||
                (file == null && videoUrl != null);
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
