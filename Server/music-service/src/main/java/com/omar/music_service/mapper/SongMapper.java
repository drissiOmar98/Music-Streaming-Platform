package com.omar.music_service.mapper;

import com.omar.music_service.client.Artist.DisplayCardArtistDTO;
import com.omar.music_service.dto.ReadSongInfoDTO;
import com.omar.music_service.dto.SongRequestDTO;
import com.omar.music_service.entities.Song;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SongMapper {

    @Mapping(target = "id", ignore = true)
    Song toSong(SongRequestDTO saveSongDTO);

    @Mapping(target = "id", source = "song.id")
    @Mapping(target = "title", source = "song.title")
    @Mapping(target = "artistId", source = "song.artistId")
    @Mapping(target = "cover", source = "song.cover")
    @Mapping(target = "coverContentType", source = "song.coverContentType")
    @Mapping(target = "genre", source = "song.genre")
    @Mapping(target = "artistInfo", source = "artistDetails")
    ReadSongInfoDTO songToReadSongInfoDTO(Song song, DisplayCardArtistDTO artistDetails);


}
