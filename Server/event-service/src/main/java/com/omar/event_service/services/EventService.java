package com.omar.event_service.services;

import com.omar.event_service.dto.common.EventVideoDTO;
import com.omar.event_service.dto.request.EventRequest;

import com.omar.event_service.dto.response.DisplayCardEventDTO;
import com.omar.event_service.dto.response.DisplayEventDTO;
import com.omar.event_service.shared.state.State;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.Set;

public interface EventService {

    Long createEvent(EventRequest request);

    Page<DisplayCardEventDTO> getAllEvents(Pageable pageable);


}
