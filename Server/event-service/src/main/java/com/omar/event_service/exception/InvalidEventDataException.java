package com.omar.event_service.exception;

public class InvalidEventDataException  extends RuntimeException {
    public InvalidEventDataException(String message) {
        super(message);
    }
}
