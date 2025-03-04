package com.omar.music_service.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.omar.music_service.dto.ReadSongInfoDTO;
import com.omar.music_service.dto.SongContentDTO;
import com.omar.music_service.dto.SongDetailsResponse;
import com.omar.music_service.dto.SongRequestDTO;
import com.omar.music_service.services.Impl.SongService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/songs")
public class SongController {

    private final SongService songService;

    private final Validator validator;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public SongController(SongService songService, Validator validator) {
        this.songService = songService;
        this.validator = validator;
    }


    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Long> add(@RequestPart(name = "cover") MultipartFile cover,
                                               @RequestPart(name = "file") MultipartFile file,
                                               @RequestPart(name = "dto") String saveSongDTOString) throws IOException {

        SongRequestDTO saveSongDTO = objectMapper.readValue(saveSongDTOString, SongRequestDTO.class);

        saveSongDTO = new SongRequestDTO(
                saveSongDTO.title(),
                saveSongDTO.artistId(),
                cover.getBytes(),
                cover.getContentType(),
                file.getBytes(),
                file.getContentType(),
                saveSongDTO.genre()
        );

        Set<ConstraintViolation<SongRequestDTO>> violations = validator.validate(saveSongDTO);
        if (!violations.isEmpty()) {
            String violationsJoined = violations
                    .stream()
                    .map(violation -> violation.getPropertyPath() + " " + violation.getMessage())
                    .collect(Collectors.joining());
            ProblemDetail validationIssue = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST,
                    "Validation errors for the fields : " + violationsJoined);
            return ResponseEntity.of(validationIssue).build();
        } else {
            return ResponseEntity.ok(songService.create(saveSongDTO));
        }
    }


    @GetMapping("/all")
    public ResponseEntity<List<ReadSongInfoDTO>> getAll() {
        return ResponseEntity.ok(songService.getAll());
    }


    @GetMapping("/artist/{artistId}")
    public ResponseEntity<List<ReadSongInfoDTO>> getSongsByArtist(@PathVariable Long artistId) {
        return ResponseEntity.ok(songService.getSongsByArtistId(artistId));
    }

    @GetMapping("/get-content")
    public ResponseEntity<SongContentDTO> getSongContent(@RequestParam Long songId) {
        return songService.getOneById(songId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/get-info")
    public ResponseEntity<ReadSongInfoDTO> getSongInfo(@RequestParam Long songId) {
        return songService.getSongInfoById(songId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }




    @DeleteMapping("/{songId}")
    public ResponseEntity<Void> deleteSong(@PathVariable Long songId) {
        songService.delete(songId);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/details/{songId}")
    public ResponseEntity<SongDetailsResponse> getSongDetails(@PathVariable Long songId) {
        Optional<SongDetailsResponse> response = songService.getSongDetails(songId);
        return response.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }




}
