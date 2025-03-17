package com.omar.playlist_service.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.omar.playlist_service.client.song.ReadSongInfoDTO;
import com.omar.playlist_service.dto.AddSongToPlaylistRequest;
import com.omar.playlist_service.dto.PlaylistRequest;
import com.omar.playlist_service.dto.PlaylistResponse;
import com.omar.playlist_service.dto.RemoveSongFromPlaylistRequest;
import com.omar.playlist_service.service.PlaylistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Valid;
import jakarta.validation.Validator;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/playlists")
@Tag(name = "Playlist Controller", description = "APIs for managing playlists")
public class PlaylistController {

    private final PlaylistService playlistService;

    private final Validator validator;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public PlaylistController(PlaylistService playlistService,  Validator validator) {
        this.playlistService = playlistService;
        this.validator = validator;
    }

    @Operation(summary = "Create a new playlist", description = "Create a new playlist with a cover image")
    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Long> add(@RequestPart(name = "cover") MultipartFile cover,
                                    @RequestPart(name = "dto") String savePlaylistDTOString,
                                    Authentication authentication) throws IOException {

        PlaylistRequest playlistRequest = objectMapper.readValue(savePlaylistDTOString, PlaylistRequest.class);

        playlistRequest = new PlaylistRequest(
                playlistRequest.title(),
                playlistRequest.description(),
                cover.getBytes(),
                cover.getContentType(),
                playlistRequest.songIds()
        );

        Set<ConstraintViolation<PlaylistRequest>> violations = validator.validate(playlistRequest);
        if (!violations.isEmpty()) {
            String violationsJoined = violations
                    .stream()
                    .map(violation -> violation.getPropertyPath() + " " + violation.getMessage())
                    .collect(Collectors.joining());
            ProblemDetail validationIssue = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST,
                    "Validation errors for the fields : " + violationsJoined);
            return ResponseEntity.of(validationIssue).build();
        } else {
            return ResponseEntity.ok(playlistService.createPlaylist(playlistRequest,authentication));
        }

    }


    @Operation(summary = "Update a playlist", description = "Update an existing playlist with optional cover image")
    @PutMapping(value = "/{id}/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Long> updatePlaylist(
            @PathVariable Long id,
            @RequestPart(name = "cover", required = false) MultipartFile cover,
            @RequestPart(name = "dto") String playlistRequestString,
            Authentication authentication
    ) throws IOException {
        // Deserialize the JSON string to PlaylistRequest
        PlaylistRequest playlistRequest = objectMapper.readValue(playlistRequestString, PlaylistRequest.class);

        // Create a new PlaylistRequest instance with the updated cover data (if provided)
        PlaylistRequest updatedPlaylistRequest = new PlaylistRequest(
                playlistRequest.title(),
                playlistRequest.description(),
                cover != null ? cover.getBytes() : playlistRequest.cover(),  // Preserve existing cover if not updated
                cover != null ? cover.getContentType() : playlistRequest.coverContentType(),
                playlistRequest.songIds()
        );

        // Validate the updated PlaylistRequest object
        Set<ConstraintViolation<PlaylistRequest>> violations = validator.validate(updatedPlaylistRequest);
        if (!violations.isEmpty()) {
            String violationsJoined = violations.stream()
                    .map(violation -> violation.getPropertyPath() + " " + violation.getMessage())
                    .collect(Collectors.joining());
            ProblemDetail validationIssue = ProblemDetail.forStatusAndDetail(
                    HttpStatus.BAD_REQUEST,
                    "Validation errors for the fields: " + violationsJoined
            );
            return ResponseEntity.of(validationIssue).build();
        }

        // Call the service to update the playlist
        Long updatedPlaylistId = playlistService.updatePlaylist(id, updatedPlaylistRequest, authentication);
        return ResponseEntity.ok(updatedPlaylistId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlaylist(@PathVariable Long id, Authentication authentication) {
        playlistService.deletePlaylist(id, authentication);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<PlaylistResponse>> getAllPlaylistsByUser(Authentication authentication) {
        return ResponseEntity.ok(playlistService.getAllPlaylistsByUser(authentication));
    }

    @GetMapping("/{playlistId}/songs")
    public ResponseEntity<Set<ReadSongInfoDTO>> getSongsInPlaylist(@PathVariable Long playlistId, Authentication authentication) {
        return ResponseEntity.ok(playlistService.getSongsInPlaylist(playlistId, authentication));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlaylistResponse> getPlaylistById(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok( playlistService.getPlaylistById(id, authentication));
    }

    @PostMapping("/add-song")
    public ResponseEntity<Void> addSongToPlaylist( @Valid @RequestBody AddSongToPlaylistRequest request,Authentication authentication) {
        playlistService.addSongToPlaylist(request, authentication);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/remove-song")
    public ResponseEntity<Void> removeSongFromPlaylist(@Valid @RequestBody RemoveSongFromPlaylistRequest request, Authentication authentication) {
        playlistService.removeSongFromPlaylist(request, authentication);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{playlistId}/clear")
    public ResponseEntity<Void> clearPlaylist(@PathVariable Long playlistId, Authentication authentication) {
        playlistService.clearPlaylist(playlistId, authentication);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{playlistId}/contains-song/{songId}")
    public ResponseEntity<Boolean> isSongInPlaylist(@PathVariable Long playlistId, @PathVariable Long songId, Authentication authentication) {
        return ResponseEntity.ok(playlistService.isSongInPlaylist(playlistId, songId, authentication));
    }

    @PutMapping("/{playlistId}/reorder")
    public ResponseEntity<Void> reorderSongsInPlaylist(@PathVariable Long playlistId, @Valid @RequestBody List<Long> newOrder, Authentication authentication) {
        playlistService.reorderSongsInPlaylist(playlistId, newOrder, authentication);
        return ResponseEntity.noContent().build();
    }






}
