package com.omar.favorites_service.exception;

public class SongNotFoundException extends RuntimeException{
    public SongNotFoundException(String message){
        super(message);
    }
}
