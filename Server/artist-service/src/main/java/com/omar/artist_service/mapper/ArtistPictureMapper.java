package com.omar.artist_service.mapper;


import com.omar.artist_service.dto.PictureDTO;
import com.omar.artist_service.model.ArtistPicture;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring")
public interface ArtistPictureMapper {

    /**
     * Maps a list of PictureDTO objects to a set of ArtistPicture entities.
     *
     * @param pictureDTOs The list of PictureDTOs to be mapped.
     * @return A set of ArtistPicture entities.
     */
    Set<ArtistPicture> pictureDTOsToArtistPictures(List<PictureDTO> pictureDTOs);


    /**
     * Maps a single PictureDTO to a ArtistPicture entity, ignoring certain fields.
     *
     * @param pictureDTO The PictureDTO to be mapped.
     * @return A ListingPicture entity populated with the data from the DTO.
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "artist", ignore = true)
    @Mapping(target = "isCover", source = "isCover")
    ArtistPicture pictureDTOToArtistPicture(PictureDTO pictureDTO);


    /**
     * Maps a list of ArtistPicture entities to a list of PictureDTOs.
     *
     * @param  artistPictures The list of ArtistPicture entities to be mapped.
     * @return A list of PictureDTOs.
     */
    List<PictureDTO> artistPictureToPictureDTO(List<ArtistPicture> artistPictures);


    /**
     * Maps a single ArtistPicture entity to a PictureDTO, with a specific mapping for the 'cover' field.
     *
     * @param  artistPicture The ArtistPicture entity to be mapped.
     * @return A PictureDTO populated with the data from the ArtistPicture entity.
     */
    @Mapping(target = "isCover", source = "cover")
    PictureDTO convertToPictureDTO(ArtistPicture  artistPicture);


    /**
     * Extracts the cover picture from a set of ArtistPicture entities and converts it to a PictureDTO.
     *
     * @param pictures The set of ArtistPicture entities.
     * @return The PictureDTO representing the cover picture.
     */
    @Named("extract-cover")
    default PictureDTO extractCover(Set<ArtistPicture> pictures) {
        return pictures.stream().findFirst().map(this::convertToPictureDTO).orElseThrow();
    }









}
