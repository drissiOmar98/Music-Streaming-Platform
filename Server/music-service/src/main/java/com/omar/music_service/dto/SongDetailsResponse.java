package com.omar.music_service.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode
public class SongDetailsResponse {
    private ReadSongInfoDTO songInfo;
    private SongContentDTO songContent;
}
