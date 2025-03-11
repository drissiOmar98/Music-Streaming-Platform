package com.omar.follow_service.handlerException;



import com.omar.follow_service.exception.ArtistNotFoundException;
import com.omar.follow_service.exception.FollowAlreadyExistsException;
import com.omar.follow_service.exception.FollowNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;


@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ArtistNotFoundException.class)
    public ResponseEntity<ExceptionResponse> handleSongNotFoundException(ArtistNotFoundException ex) {
        ExceptionResponse response = ExceptionResponse.builder()
                .statusCode(HttpStatus.NOT_FOUND.value())
                .message(ex.getMessage())
                .error(HttpStatus.NOT_FOUND.getReasonPhrase())
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(FollowAlreadyExistsException.class)
    public ResponseEntity<ExceptionResponse> handleFavouriteAlreadyExistsException(FollowAlreadyExistsException ex) {
        ExceptionResponse response = ExceptionResponse.builder()
                .statusCode(HttpStatus.CONFLICT.value())
                .message(ex.getMessage())
                .error(HttpStatus.CONFLICT.getReasonPhrase())
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(FollowNotFoundException.class)
    public ResponseEntity<ExceptionResponse> handleFavouriteNotFoundException(FollowNotFoundException ex) {
        ExceptionResponse response = ExceptionResponse.builder()
                .statusCode(HttpStatus.NOT_FOUND.value())
                .message(ex.getMessage())
                .error(HttpStatus.NOT_FOUND.getReasonPhrase())
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
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
