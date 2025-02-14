package com.omar.artist_service.dto;


public record DisplayCardArtistDTO(
        Long id,
        String name,
        String bio,
        PictureDTO cover
) {

}
