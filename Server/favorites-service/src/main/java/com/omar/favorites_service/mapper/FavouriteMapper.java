package com.omar.favorites_service.mapper;

import com.omar.favorites_service.client.song.ReadSongInfoDTO;
import com.omar.favorites_service.dto.FavouriteRequest;
import com.omar.favorites_service.dto.FavouriteResponse;
import com.omar.favorites_service.model.Favourite;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FavouriteMapper {

    @Mapping(target = "userId", source = "userId")
    @Mapping(target = "songId", source = "request.songId")
    Favourite toEntity(FavouriteRequest request, String userId);


    @Mapping(target = "songDetails", source = "songDetails")
    FavouriteResponse toFavouriteResponse(Favourite favourite, ReadSongInfoDTO songDetails);



}
