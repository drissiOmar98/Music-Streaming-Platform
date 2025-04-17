package com.omar.event_service.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.omar.event_service.dto.common.EventVideoDTO;
import com.omar.event_service.dto.common.PictureDTO;
import com.omar.event_service.dto.request.EventRequest;
import com.omar.event_service.dto.response.DisplayCardEventDTO;
import com.omar.event_service.dto.response.DisplayEventDTO;
import com.omar.event_service.exception.FileProcessingException;
import com.omar.event_service.services.EventService;
import com.omar.event_service.shared.state.State;
import com.omar.event_service.shared.state.StatusNotification;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/events")
public class EventController {

    private final EventService eventService;

    private ObjectMapper objectMapper = new ObjectMapper();

    private final Validator validator;


    public EventController(EventService eventService, Validator validator) {
        this.eventService = eventService;
        this.validator = validator;
    }


    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createEvent(
            MultipartHttpServletRequest request,
            @RequestPart(name = "videoFile", required = false) MultipartFile videoFile,
            @RequestPart(name = "eventRequest") String eventRequestString
    ) throws IOException {

        // 1. Process pictures
        List<PictureDTO> pictures = request.getFileMap()
                .values()
                .stream()
                .filter(file -> !file.getName().equals("videoFile"))
                .map(mapMultipartFileToPictureDTO())
                .toList();

        // 2. Parse main request
        EventRequest eventRequest = objectMapper.readValue(eventRequestString, EventRequest.class);

        // 3. Process video with validation guards
        EventVideoDTO videoDto;
        try {
            videoDto = videoFile != null
                    ? new EventVideoDTO(null, videoFile.getBytes(), videoFile.getContentType(), null)
                    : eventRequest.video();
        } catch (IOException e) {
            throw new FileProcessingException("Video file processing failed");
        }

        // 4. Build complete request
        EventRequest completeRequest = new EventRequest(
                eventRequest.infos(),
                eventRequest.location(),
                eventRequest.dateRange(),
                pictures,
                videoDto,
                eventRequest.artistIds()
        );

        // 5. Validate ALL constraints (including EventVideoDTO rules)
        Set<ConstraintViolation<EventRequest>> violations = validator.validate(completeRequest);
        if (!violations.isEmpty()) {
            String errorDetails = violations.stream()
                    .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                    .collect(Collectors.joining("; "));

            return ResponseEntity.badRequest()
                    .body(ProblemDetail.forStatusAndDetail(
                            HttpStatus.BAD_REQUEST,
                            "Validation failed: " + errorDetails
                    ));
        }

        return ResponseEntity.ok(eventService.createEvent(completeRequest));
    }



    @GetMapping("/get-all")
    public ResponseEntity<Page<DisplayCardEventDTO>> getAllEvents(Pageable pageable) {
        return ResponseEntity.ok(eventService.getAllEvents(pageable));
    }

    @GetMapping("/artist/{artistId}")
    public ResponseEntity<Page<DisplayCardEventDTO>> getEventsByArtist(
            @PathVariable Long artistId,
            Pageable pageable) {
        return ResponseEntity.ok(eventService.getEventsByArtist(artistId, pageable) );
    }

    @GetMapping("/upcoming")
    public ResponseEntity<Page<DisplayCardEventDTO>> getUpcomingEvents(
            Pageable pageable) {
        return ResponseEntity.ok(eventService.getUpcomingEvents(pageable));
    }

    @GetMapping("/past")
    public ResponseEntity<Page<DisplayCardEventDTO>> getPastEvents(
            Pageable pageable) {
        return ResponseEntity.ok(eventService.getPastEvents(pageable));
    }

    @GetMapping("/{eventId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<DisplayEventDTO> getEventById(@PathVariable Long eventId) {
        State<DisplayEventDTO, String> displayEventState = eventService.getEventById(eventId);
        if (displayEventState.getStatus().equals(StatusNotification.OK)) {
            return ResponseEntity.ok(displayEventState.getValue());
        } else {
            ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, displayEventState.getError());
            return ResponseEntity.of(problemDetail).build();
        }
    }





    /**
     * Utility function to map a MultipartFile to a PictureDTO.
     *
     * @return A function that converts MultipartFile to PictureDTO.
     */
    private static Function<MultipartFile, PictureDTO> mapMultipartFileToPictureDTO() {
        return multipartFile -> {
            try {
                return new PictureDTO(
                        multipartFile.getBytes(),
                        multipartFile.getContentType(),
                        false
                );
            } catch (IOException e) {
                throw new FileProcessingException(
                        String.format("Failed to process file '%s': %s",
                                multipartFile.getOriginalFilename(),
                                e.getMessage())
                );
            }
        };
    }

}
