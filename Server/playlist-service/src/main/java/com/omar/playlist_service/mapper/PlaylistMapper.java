package com.omar.playlist_service.mapper;

import com.omar.playlist_service.client.song.ReadSongInfoDTO;
import com.omar.playlist_service.dto.PlaylistRequest;
import com.omar.playlist_service.dto.PlaylistResponse;
import com.omar.playlist_service.model.Playlist;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Set;

@Mapper(componentModel = "spring")
public interface PlaylistMapper {


    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userId", source = "userId")
    @Mapping(target = "songIds", source = "request.songIds")
    Playlist toEntity(PlaylistRequest request, String userId);


    @Mapping(target = "songs", source = "songs")
    PlaylistResponse toPlaylistResponse(Playlist playlist, Set<ReadSongInfoDTO> songs);


}
