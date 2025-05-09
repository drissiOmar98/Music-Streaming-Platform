package com.omar.event_participation_service.controllers;

import com.omar.event_participation_service.dto.EventParticiaptionRequest;
import com.omar.event_participation_service.dto.EventParticipationResponse;
import com.omar.event_participation_service.services.EventParticipationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/attendances")
public class EventParticipationController {

    private final EventParticipationService eventParticipationService;

    public EventParticipationController(EventParticipationService eventParticipationService) {
        this.eventParticipationService = eventParticipationService;
    }

    @PostMapping("/join")
    public ResponseEntity<Void> joinEvent(
            @RequestBody @Valid EventParticiaptionRequest request,
            Authentication authentication) {
        eventParticipationService.joinEvent(request, authentication);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/leave/{eventId}")
    public ResponseEntity<Void> leaveEvent(
            @PathVariable Long eventId,
            Authentication authentication) {
        eventParticipationService.leaveEvent(eventId, authentication);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/joined-events")
    public ResponseEntity<List<EventParticipationResponse>> getJoinedEvents(
            Authentication authentication) {
        return ResponseEntity.ok(eventParticipationService.getJoinedEvents(authentication));
    }



}
