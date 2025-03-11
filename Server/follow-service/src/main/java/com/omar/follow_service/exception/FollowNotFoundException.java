package com.omar.follow_service.exception;

public class FollowNotFoundException extends RuntimeException {
    public FollowNotFoundException(String message) {
        super(message);
    }
}