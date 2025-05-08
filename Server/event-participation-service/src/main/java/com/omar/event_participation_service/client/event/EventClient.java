package com.omar.event_participation_service.client.event;

import com.omar.event_participation_service.config.FeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Component
@FeignClient(
        name = "event-service",
        url = "${application.config.event-url}",
        configuration = FeignConfig.class
)
public interface EventClient {

    @GetMapping("/{id}")
    EventDTO getEventDetailsById(@PathVariable Long id);
}
