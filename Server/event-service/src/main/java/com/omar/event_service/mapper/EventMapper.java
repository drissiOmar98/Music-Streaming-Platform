package com.omar.event_service.mapper;

import com.omar.event_service.client.artist.DisplayCardArtistDTO;
import com.omar.event_service.dto.request.EventRequest;
import com.omar.event_service.dto.response.DisplayCardEventDTO;
import com.omar.event_service.dto.response.DisplayEventDTO;
import com.omar.event_service.model.Event;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {EventPictureMapper.class})
public interface EventMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "title", source = "infos.title")
    @Mapping(target = "description", source = "infos.description")
    @Mapping(target = "startDateTime", expression = "java(parseDate(request.dateRange().startDateTime()))")
    @Mapping(target = "endDateTime", expression = "java(parseDate(request.dateRange().endDateTime()))")
    @Mapping(target = "artistIds", source = "artistIds")
    Event toEntity(EventRequest request);

    default Date parseDate(String dateString) {
        try {
            return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(dateString);
        } catch (ParseException e) {
            throw new RuntimeException("Failed to parse date: " + dateString, e);
        }
    }


    default List<DisplayCardEventDTO> eventToDisplayCardEventDTOs(
            List<Event> events,
            Set<DisplayCardArtistDTO> artists
    ) {
        if (events == null) {
            return Collections.emptyList();
        }
        return events.stream()
                .map(event -> eventToDisplayCardEventDTO(event, artists))
                .collect(Collectors.toList());
    }


    // Convert Entity to DisplayCard DTO
    @Mapping(target = "artists", source = "artists")
    @Mapping(target = "cover", source = "event.pictures", qualifiedByName = "extract-cover")
    DisplayCardEventDTO eventToDisplayCardEventDTO(Event event, Set<DisplayCardArtistDTO> artists);

    // Convert Entity to full Display DTO
    @Mapping(target = "artists", source = "artists")
    DisplayEventDTO eventToDisplayEventDTO(Event event,Set<DisplayCardArtistDTO> artists);
}
