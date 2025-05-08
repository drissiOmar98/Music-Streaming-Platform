package com.omar.event_participation_service.client.event;

import com.omar.event_participation_service.client.artist.DisplayCardArtistDTO;

import java.util.Date;
import java.util.Set;

public record EventDTO(
        Long id,
        String title,
        String location,
        Date startDateTime,
        Date endDateTime,
        PictureDTO cover,
        Set<DisplayCardArtistDTO> artists
) {
}
