package com.omar.artist_service.exception;

public class ArtistNotFoundException extends RuntimeException{
    public ArtistNotFoundException(String message){
        super(message);
    }
}
