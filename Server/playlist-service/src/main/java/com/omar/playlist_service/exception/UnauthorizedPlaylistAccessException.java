package com.omar.playlist_service.exception;

public class UnauthorizedPlaylistAccessException extends RuntimeException {
    public UnauthorizedPlaylistAccessException(String message) {
        super(message);
    }
}