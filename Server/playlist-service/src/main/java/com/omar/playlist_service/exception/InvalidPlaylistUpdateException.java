package com.omar.playlist_service.exception;

public class InvalidPlaylistUpdateException extends RuntimeException {
    public InvalidPlaylistUpdateException(String message) {
        super(message);
    }
}