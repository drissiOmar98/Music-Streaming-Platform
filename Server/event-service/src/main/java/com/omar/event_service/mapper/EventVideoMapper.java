package com.omar.event_service.mapper;

import com.omar.event_service.dto.common.EventVideoDTO;
import com.omar.event_service.dto.request.EventRequest;
import com.omar.event_service.model.EventVideo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface EventVideoMapper {

    @Mapping(target = "eventId", source = "event.id")
    EventVideoDTO toDto(EventVideo eventVideo);

    @Mapping(target = "file", source = "video.file")
    @Mapping(target = "fileContentType", source = "video.fileContentType")
    @Mapping(target = "videoUrl", source = "video.videoUrl")
    EventVideo saveVideoToEvent(EventRequest eventRequest);


    @Mapping(target = "id", ignore = true)
    @Mapping(target = "event", ignore = true)
    @Mapping(target = "file", source = "video.file")
    @Mapping(target = "fileContentType", source = "video.fileContentType")
    @Mapping(target = "videoUrl", source = "video.videoUrl")
    void updateVideoFromRequest(EventRequest request, @MappingTarget EventVideo eventVideo);

}
