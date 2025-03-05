package com.omar.favorites_service.client.song;


import com.omar.favorites_service.config.FeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Component
@FeignClient(
        name = "music-service",
        url = "${application.config.music-url}",
        configuration = FeignConfig.class
)
public interface SongClient {

    @GetMapping("/get-info")
    ReadSongInfoDTO getSongInfo(@RequestParam("songId") Long songId);
}
