package com.omar.artist_service.mapper;


import com.omar.artist_service.dto.ArtistRequest;
import com.omar.artist_service.dto.DisplayArtistDTO;
import com.omar.artist_service.dto.DisplayCardArtistDTO;
import com.omar.artist_service.model.Artist;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ArtistPictureMapper.class})
public interface ArtistMapper {


    @Mapping(target = "name", source = "infos.name")
    @Mapping(target = "bio", source = "infos.bio")
    Artist toArtist(ArtistRequest artistRequest);

    @Mapping(target = "cover", source = "pictures")
    List<DisplayCardArtistDTO> artistToDisplayCardArtistDTOs(List<Artist> artists);


    @Mapping(target = "cover", source = "pictures", qualifiedByName = "extract-cover")
    DisplayCardArtistDTO artistToDisplayCardArtistDTO(Artist artist);


    DisplayArtistDTO artistToDisplayArtistDTO(Artist artist);


}
