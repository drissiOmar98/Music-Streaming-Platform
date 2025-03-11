package com.omar.follow_service.mapper;


import com.omar.follow_service.client.artist.ArtistDTO;
import com.omar.follow_service.dto.FollowRequest;
import com.omar.follow_service.dto.FollowResponse;
import com.omar.follow_service.model.Follow;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FollowMapper {

    @Mapping(target = "userId", source = "userId")
    @Mapping(target = "artistId", source = "request.artistId")
    Follow toEntity(FollowRequest request, String userId);


    @Mapping(target = "artistDetails", source = "artistDetails")
    FollowResponse toFollowResponse(Follow follow, ArtistDTO artistDetails);
}
