package com.omar.user_service.dto;


import com.omar.user_service.entity.User;


import java.util.Set;


public record RestUser(Long id,
                       String firstName,
                       String lastName,
                       String email,
                       String imageUrl,
                       Set<RestAuthority> authorities) {


    public static RestUser from(User user) {
        return new RestUser(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getImageUrl(),
                RestAuthority.fromSet(user.getAuthorities())
        );
    }
}

