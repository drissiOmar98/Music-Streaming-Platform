package com.omar.favorites_service.client.user;

public record UserResponse(
        String id,
        String firstname,
        String lastname,
        String email
) {
}
