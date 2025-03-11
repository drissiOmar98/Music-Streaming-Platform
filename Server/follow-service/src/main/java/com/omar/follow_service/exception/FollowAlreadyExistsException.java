package com.omar.follow_service.exception;

public class FollowAlreadyExistsException extends RuntimeException {
    public FollowAlreadyExistsException(String message) {
        super(message);
    }
}