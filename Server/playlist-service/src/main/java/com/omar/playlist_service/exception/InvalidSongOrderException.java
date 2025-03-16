package com.omar.playlist_service.exception;

public class InvalidSongOrderException extends RuntimeException {
    public InvalidSongOrderException(String message) {
        super(message);
    }
}