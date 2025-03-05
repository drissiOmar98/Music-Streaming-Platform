package com.omar.favorites_service.exception;

public class FavouriteNotFoundException extends RuntimeException {
    public FavouriteNotFoundException(String message) {
        super(message);
    }
}
