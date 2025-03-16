package com.omar.playlist_service.handlerException;


import com.omar.playlist_service.exception.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;


@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(SongNotFoundException.class)
    public ResponseEntity<ExceptionResponse> handleSongNotFoundException(SongNotFoundException ex) {
        ExceptionResponse response = ExceptionResponse.builder()
                .statusCode(HttpStatus.NOT_FOUND.value())
                .message(ex.getMessage())
                .error(HttpStatus.NOT_FOUND.getReasonPhrase())
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(PlaylistAlreadyExistsException.class)
    public ResponseEntity<ExceptionResponse> handleFavouriteAlreadyExistsException(PlaylistAlreadyExistsException ex) {
        ExceptionResponse response = ExceptionResponse.builder()
                .statusCode(HttpStatus.CONFLICT.value())
                .message(ex.getMessage())
                .error(HttpStatus.CONFLICT.getReasonPhrase())
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(PlaylistNotFoundException.class)
    public ResponseEntity<ExceptionResponse> handleFavouriteNotFoundException(PlaylistNotFoundException ex) {
        ExceptionResponse response = ExceptionResponse.builder()
                .statusCode(HttpStatus.NOT_FOUND.value())
                .message(ex.getMessage())
                .error(HttpStatus.NOT_FOUND.getReasonPhrase())
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UnauthorizedPlaylistAccessException.class)
    public ResponseEntity<ExceptionResponse> handleUnauthorizedPlaylistAccessException(UnauthorizedPlaylistAccessException ex) {
        ExceptionResponse response = ExceptionResponse.builder()
                .statusCode(HttpStatus.FORBIDDEN.value())
                .message(ex.getMessage())
                .error(HttpStatus.FORBIDDEN.getReasonPhrase())
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(InvalidPlaylistUpdateException.class)
    public ResponseEntity<ExceptionResponse> handleInvalidPlaylistUpdateException(InvalidPlaylistUpdateException ex) {
        ExceptionResponse response = ExceptionResponse.builder()
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .message(ex.getMessage())
                .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidSongOrderException.class)
    public ResponseEntity<ExceptionResponse> handleInvalidSongOrderException(InvalidSongOrderException ex) {
        ExceptionResponse response = ExceptionResponse.builder()
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .message(ex.getMessage())
                .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ExceptionResponse> handleMaxUploadSizeExceededException(MaxUploadSizeExceededException ex) {
        ExceptionResponse response = ExceptionResponse.builder()
                .statusCode(HttpStatus.PAYLOAD_TOO_LARGE.value())
                .message("File size exceeds the maximum allowed limit.")
                .error(HttpStatus.PAYLOAD_TOO_LARGE.getReasonPhrase())
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(response, HttpStatus.PAYLOAD_TOO_LARGE);
    }


    @ExceptionHandler(MultipartException.class)
    public ResponseEntity<ExceptionResponse> handleMultipartException(MultipartException ex) {
        ExceptionResponse response = ExceptionResponse.builder()
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .message("Invalid file upload request.")
                .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }


    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ExceptionResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> validationErrors = ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage));

        ExceptionResponse response = ExceptionResponse.builder()
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .message("Validation failed")
                .error(HttpStatus.BAD_REQUEST.getReasonPhrase())
                .validationErrors(validationErrors)
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionResponse> handleGenericException(Exception ex) {
        ExceptionResponse response = ExceptionResponse.builder()
                .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message(ex.getMessage())
                .error(HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase())
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }





}
