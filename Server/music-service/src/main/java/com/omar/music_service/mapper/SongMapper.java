package com.omar.music_service.mapper;

import com.omar.music_service.dto.ReadSongInfoDTO;
import com.omar.music_service.dto.SongRequestDTO;
import com.omar.music_service.entities.Song;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SongMapper {

    @Mapping(target = "id", ignore = true)
    Song toSong(SongRequestDTO saveSongDTO);

    ReadSongInfoDTO songToReadSongInfoDTO(Song song);


}
