package com.omar.playlist_service.client.song;


import com.omar.playlist_service.client.artist.DisplayCardArtistDTO;
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
    private DisplayCardArtistDTO artistInfo;
}
