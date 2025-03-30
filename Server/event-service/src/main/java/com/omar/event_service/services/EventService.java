package com.omar.event_service.services;

import com.omar.event_service.dto.request.EventRequest;

public interface EventService {

    Long createEvent(EventRequest request);
}
