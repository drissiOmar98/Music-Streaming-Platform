package com.omar.music_service.mapper;


import com.omar.music_service.dto.SongContentDTO;
import com.omar.music_service.dto.SongRequestDTO;
import com.omar.music_service.entities.SongContent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring")
public interface SongContentMapper {


    @Mapping(target = "songId", source = "song.id")
    SongContentDTO songContentToSongContentDTO(SongContent songContent);

//    @Mapping(target = "song", ignore = true)
//    SongContent toSongContent(SongContentDTO songContentDTO);

    SongContent saveSongDTOToSong(SongRequestDTO songDTO);
}
