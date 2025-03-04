package com.omar.music_service.client.Artist;


public record DisplayCardArtistDTO(
        Long id,
        String name,
        String bio,
        PictureDTO cover
) {

}
