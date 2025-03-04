package com.omar.music_service.client.Artist;

import com.omar.music_service.config.FeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Component
@FeignClient(
        name = "artist-service",
        url = "${application.config.artist-url}",
        configuration = FeignConfig.class
)
public interface ArtistClient {

    @GetMapping("/{id}")
    DisplayCardArtistDTO getArtistDetailsById(@PathVariable Long id);
}
