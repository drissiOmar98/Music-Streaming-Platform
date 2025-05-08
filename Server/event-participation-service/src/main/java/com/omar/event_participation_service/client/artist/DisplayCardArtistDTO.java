package com.omar.event_participation_service.client.artist;


import com.omar.event_participation_service.client.event.PictureDTO;

public record DisplayCardArtistDTO(
        Long id,
        String name,
        String bio,
        PictureDTO cover
) {

}
