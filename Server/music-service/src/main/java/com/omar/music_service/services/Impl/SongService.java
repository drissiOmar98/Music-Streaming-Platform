package com.omar.music_service.services.Impl;

import com.omar.music_service.dto.ReadSongInfoDTO;
import com.omar.music_service.dto.SongContentDTO;
import com.omar.music_service.dto.SongDetailsResponse;
import com.omar.music_service.dto.SongRequestDTO;

import java.util.List;
import java.util.Optional;

public interface SongService {

    Long create(SongRequestDTO songRequestDTO);

    List<ReadSongInfoDTO> getAll();

    List<ReadSongInfoDTO> getSongsByArtistId(Long artistId);

    Optional<SongContentDTO> getOneById(Long songId);

    void delete(Long songId);

    Optional<SongDetailsResponse> getSongDetails(Long songId);



}
