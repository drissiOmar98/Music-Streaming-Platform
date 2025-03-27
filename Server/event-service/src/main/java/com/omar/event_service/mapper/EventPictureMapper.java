package com.omar.event_service.mapper;



import com.omar.event_service.dto.common.PictureDTO;
import com.omar.event_service.model.EventPicture;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring")
public interface EventPictureMapper {

    /**
     * Maps a list of PictureDTO objects to a set of EventPicture entities.
     *
     * @param pictureDTOs The list of PictureDTOs to be mapped.
     * @return A set of EventPicture entities.
     */
    Set<EventPicture> pictureDTOsToArtistPictures(List<PictureDTO> pictureDTOs);


    /**
     * Maps a single PictureDTO to a EventPicture entity, ignoring certain fields.
     *
     * @param pictureDTO The PictureDTO to be mapped.
     * @return An EventPicture entity populated with the data from the DTO.
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "event", ignore = true)
    @Mapping(target = "isCover", source = "isCover")
    EventPicture pictureDTOToArtistPicture(PictureDTO pictureDTO);


    /**
     * Maps a list of EventPicture entities to a list of PictureDTOs.
     *
     * @param  eventPictures The list of EventPicture entities to be mapped.
     * @return A list of PictureDTOs.
     */
    List<PictureDTO> eventPictureToPictureDTO(List<EventPicture> eventPictures);


    /**
     * Maps a single EventPicture entity to a PictureDTO, with a specific mapping for the 'cover' field.
     *
     * @param  eventPicture The EventPicture entity to be mapped.
     * @return A PictureDTO populated with the data from the EventPicture entity.
     */
    @Mapping(target = "isCover", source = "cover")
    PictureDTO convertToPictureDTO(EventPicture eventPicture);


    /**
     * Extracts the cover picture from a set of EventPicture entities and converts it to a PictureDTO.
     *
     * @param pictures The set of EventPicture entities.
     * @return The PictureDTO representing the cover picture.
     */
    @Named("extract-cover")
    default PictureDTO extractCover(Set<EventPicture> pictures) {
        return pictures.stream().findFirst().map(this::convertToPictureDTO).orElseThrow();
    }









}
