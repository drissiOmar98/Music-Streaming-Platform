package com.omar.user_service.dto;



import com.omar.user_service.entity.Authority;

import java.util.Set;
import java.util.stream.Collectors;


public record RestAuthority(String name) {

    public static Set<RestAuthority> fromSet(Set<Authority> authorities) {
        return authorities.stream()
                .map(authority -> new RestAuthority(authority.getName()))
                .collect(Collectors.toSet());
    }
}

