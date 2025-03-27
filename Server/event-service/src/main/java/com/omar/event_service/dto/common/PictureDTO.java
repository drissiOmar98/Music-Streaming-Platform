package com.omar.event_service.dto.common;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.Objects;

public record PictureDTO(
        @NotNull(message = "File content cannot be null")
        byte[] file,

        @NotBlank(message = "Content type cannot be empty")
        @Pattern(regexp = "image/(jpeg|png|gif|webp)",
                message = "Invalid image type. Allowed: jpeg, png, gif, webp")
        String fileContentType,

        @NotNull(message = "Cover flag must be specified")
        boolean isCover
) {

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PictureDTO that = (PictureDTO) o;
        return isCover == that.isCover && Objects.equals(fileContentType, that.fileContentType);
    }

    @Override
    public int hashCode() {
        return Objects.hash(fileContentType, isCover);
    }

    @Override
    public String toString() {
        return "PictureDTO{" +
                "fileContentType='" + fileContentType + '\'' +
                ", isCover=" + isCover +
                '}';
    }
}
