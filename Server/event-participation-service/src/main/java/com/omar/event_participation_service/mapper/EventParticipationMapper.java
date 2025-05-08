package com.omar.event_participation_service.mapper;


import com.omar.event_participation_service.client.event.EventDTO;
import com.omar.event_participation_service.dto.EventParticiaptionRequest;
import com.omar.event_participation_service.dto.EventParticipationResponse;
import com.omar.event_participation_service.model.EventParticipation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EventParticipationMapper {

    @Mapping(target = "userId", source = "userId")
    @Mapping(target = "eventId", source = "request.eventId")
    EventParticipation toEntity(EventParticiaptionRequest request, String userId);

    @Mapping(target = "eventDetails", source = "eventDetails")
    EventParticipationResponse toParticipationResponse(EventParticipation participation, EventDTO eventDetails);
}
