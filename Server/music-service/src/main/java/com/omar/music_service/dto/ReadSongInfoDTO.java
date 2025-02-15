package com.omar.music_service.dto;

import com.omar.music_service.entities.Genre;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode
public class ReadSongInfoDTO {
    private Long id;
    private String title;
    private Long artistId;
    private byte[] cover;
    private String coverContentType;
    private Genre genre;
}
