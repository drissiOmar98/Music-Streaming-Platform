package com.omar.follow_service.client.user;

public record UserResponse(
        String id,
        String firstname,
        String lastname,
        String email
) {
}
