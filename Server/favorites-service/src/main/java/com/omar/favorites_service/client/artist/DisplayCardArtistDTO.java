package com.omar.favorites_service.client.artist;


public record DisplayCardArtistDTO(
        Long id,
        String name,
        String bio,
        PictureDTO cover
) {

}
