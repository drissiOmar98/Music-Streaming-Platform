package com.omar.favorites_service.exception;

public class FavouriteAlreadyExistsException extends RuntimeException{
    public FavouriteAlreadyExistsException(String message) {
        super(message);
    }
}
