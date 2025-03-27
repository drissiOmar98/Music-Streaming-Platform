package com.omar.event_service.client.artist;


import com.omar.event_service.dto.common.PictureDTO;

public record DisplayCardArtistDTO(
        Long id,
        String name,
        String bio,
        PictureDTO cover
) {

}
