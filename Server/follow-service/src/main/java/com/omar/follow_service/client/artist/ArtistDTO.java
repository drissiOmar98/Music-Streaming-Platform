package com.omar.follow_service.client.artist;


public record ArtistDTO(
        Long id,
        String name,
        String bio,
        PictureDTO cover
) {

}
