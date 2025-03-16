package com.omar.playlist_service.client.song;


import com.omar.playlist_service.config.FeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(
        name = "music-service",
        url = "${application.config.music-url}",
        configuration = FeignConfig.class
)
public interface SongClient {

    @GetMapping("/get-info")
    ReadSongInfoDTO getSongInfo(@RequestParam("songId") Long songId);
}
