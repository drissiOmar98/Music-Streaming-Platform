package com.omar.event_service.dto.response;


import com.omar.event_service.client.artist.DisplayCardArtistDTO;
import com.omar.event_service.dto.common.PictureDTO;

import java.time.LocalDateTime;
import java.util.Set;

public record DisplayCardEventDTO(
        Long id,
        String title,
        String location,
        LocalDateTime startDateTime,
        LocalDateTime endDateTime,
        PictureDTO cover,
        Set<DisplayCardArtistDTO> artists
) {

}
