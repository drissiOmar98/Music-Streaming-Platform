package com.omar.playlist_service.exception;

public class PlaylistAlreadyExistsException extends RuntimeException {
    public PlaylistAlreadyExistsException(String message) {
        super(message);
    }
}