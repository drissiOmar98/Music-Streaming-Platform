package com.omar.user_service.dto;


import com.omar.user_service.entity.User;
import lombok.Builder;

import java.util.Set;

@Builder
public record RestUser(Long id,
                       String firstName,
                       String lastName,
                       String email,
                       String imageUrl,
                       Set<RestAuthority> authorities) {

    public static RestUser from(User user) {
        RestUserBuilder restUserBuilder = RestUser.builder();

        restUserBuilder.id(user.getId());

        if(user.getImageUrl() != null) {
            restUserBuilder.imageUrl(user.getImageUrl());
        }

        return restUserBuilder
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .authorities(RestAuthority.fromSet(user.getAuthorities()))
                .build();
    }
}

