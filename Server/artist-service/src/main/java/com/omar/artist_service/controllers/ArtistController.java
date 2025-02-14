package com.omar.artist_service.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.omar.artist_service.dto.ArtistRequest;
import com.omar.artist_service.dto.DisplayArtistDTO;
import com.omar.artist_service.dto.DisplayCardArtistDTO;
import com.omar.artist_service.dto.PictureDTO;
import com.omar.artist_service.exception.FileProcessingException;
import com.omar.artist_service.services.ArtistService;
import com.omar.artist_service.shared.state.State;
import com.omar.artist_service.shared.state.StatusNotification;
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
@RequestMapping("/api/v1/artists")
public class ArtistController {

    private final ArtistService artistService;

    private ObjectMapper objectMapper = new ObjectMapper();

    private final Validator validator;

    public ArtistController(ArtistService artistService, Validator validator) {
        this.artistService = artistService;
        this.validator = validator;
    }

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Long> createArtist(
            MultipartHttpServletRequest request,
            @RequestPart(name = "artistRequest") String artistRequestString
    ) throws IOException {
        List<PictureDTO> pictures = request.getFileMap()
                .values()
                .stream()
                .map(mapMultipartFileToPictureDTO())
                .toList();

        ArtistRequest artistRequest = objectMapper.readValue(artistRequestString, ArtistRequest.class);
        artistRequest = new ArtistRequest(
                artistRequest.id(),
                artistRequest.infos(),
                pictures
        );

        Set<ConstraintViolation<ArtistRequest>> violations = validator.validate(artistRequest);
        if (!violations.isEmpty()) {
            String violationsJoined = violations.stream()
                    .map(violation -> violation.getPropertyPath() + " " + violation.getMessage())
                    .collect(Collectors.joining());
            ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, violationsJoined);
            return ResponseEntity.of(problemDetail).build();
        } else {
            return ResponseEntity.ok(artistService.createArtist(artistRequest));
        }
    }

    @GetMapping("/get-one/{artistId}")
    public ResponseEntity<DisplayArtistDTO> getOne(@PathVariable Long artistId) {
        State<DisplayArtistDTO, String> displayArtistState = artistService.getOne(artistId);
        if (displayArtistState.getStatus().equals(StatusNotification.OK)) {
            return ResponseEntity.ok(displayArtistState.getValue());
        } else {
            ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, displayArtistState.getError());
            return ResponseEntity.of(problemDetail).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisplayCardArtistDTO> getArtistDetailsById(@PathVariable Long id) {
        DisplayCardArtistDTO artistDetails = artistService.getArtistDetailsWithCover(id);
        return ResponseEntity.ok(artistDetails);
    }

    @GetMapping("/exists/{artist-id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<Boolean> existsById(
            @PathVariable("artist-id") Long  artistId
    ) {
        return ResponseEntity.ok(this.artistService.existsById(artistId));
    }

    @GetMapping("/get-all")
    public ResponseEntity<Page<DisplayCardArtistDTO>> getAllArtists(
            Pageable pageable
    ) {
        return ResponseEntity.ok(artistService.getAllArtists(pageable));
    }

    @DeleteMapping("/{artistId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteArtist(@PathVariable Long artistId) {
        artistService.deleteArtist(artistId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(value = "/{artistId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateArtist(
            @PathVariable Long artistId,
            @RequestPart("artistRequest") String artistRequestString,
            MultipartHttpServletRequest request
    ) throws IOException {

        // Parse artist request JSON string
        ArtistRequest artistRequest = objectMapper.readValue(artistRequestString, ArtistRequest.class);

        // Convert received files into PictureDTOs
        List<PictureDTO> pictures = request.getFileMap()
                .values()
                .stream()
                .map(mapMultipartFileToPictureDTO())
                .toList();

        // Create a new artist request with updated pictures
        ArtistRequest updatedRequest = new ArtistRequest(
                artistRequest.id(),
                artistRequest.infos(),
                pictures
        );

        // Validate request
        Set<ConstraintViolation<ArtistRequest>> violations = validator.validate(updatedRequest);
        if (!violations.isEmpty()) {
            String violationsJoined = violations.stream()
                    .map(violation -> violation.getPropertyPath() + " " + violation.getMessage())
                    .collect(Collectors.joining(", "));
            ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, violationsJoined);
            return ResponseEntity.of(problemDetail).build();
        }

        // Update artist
        artistService.updateArtist(artistId, updatedRequest);
        return ResponseEntity.noContent().build();
    }



    /**
     * Utility function to map a MultipartFile to a PictureDTO.
     *
     * @return A function that converts MultipartFile to PictureDTO.
     */
    private static Function<MultipartFile, PictureDTO> mapMultipartFileToPictureDTO() {
        return multipartFile -> {
            try {
                // Convert the multipart file into a PictureDTO with byte data, content type, and set cover to false.
                return new PictureDTO(multipartFile.getBytes(), multipartFile.getContentType(), false);
            } catch (IOException ioe) {
                throw new FileProcessingException(String.format("Cannot parse multipart file: %s", multipartFile.getOriginalFilename()));
            }
        };
    }




}
