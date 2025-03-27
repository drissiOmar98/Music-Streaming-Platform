package com.omar.event_service.mapper;

import com.omar.event_service.client.artist.DisplayCardArtistDTO;
import com.omar.event_service.dto.request.EventRequest;
import com.omar.event_service.dto.response.DisplayCardEventDTO;
import com.omar.event_service.dto.response.DisplayEventDTO;
import com.omar.event_service.model.Event;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring", uses = {EventPictureMapper.class})
public interface EventMapper {

    @Mapping(target = "title", source = "infos.title")
    @Mapping(target = "description", source = "infos.description")
    @Mapping(target = "startDateTime", source = "dateRange.startDateTime")
    @Mapping(target = "endDateTime", source = "dateRange.endDateTime")
    @Mapping(target = "artistIds", source = "artistIds")
    Event toEntity(EventRequest request);


    // Convert List of Entities to DisplayCard DTOs
    @Mapping(target = "artists", source = "artists")
    @Mapping(target = "cover", source = "pictures")
    List<DisplayCardEventDTO> eventToDisplayCardEventDTOs(List<Event> events,Set<DisplayCardArtistDTO> artists);


    // Convert Entity to DisplayCard DTO
    @Mapping(target = "artists", source = "artists")
    @Mapping(target = "cover", source = "pictures", qualifiedByName = "extract-cover")
    DisplayCardEventDTO eventToDisplayCardEventDTO(Event event, Set<DisplayCardArtistDTO> artists);

    // Convert Entity to full Display DTO
    @Mapping(target = "artists", source = "artists")
    DisplayEventDTO eventToDisplayEventDTO(Event event,Set<DisplayCardArtistDTO> artists);
}
