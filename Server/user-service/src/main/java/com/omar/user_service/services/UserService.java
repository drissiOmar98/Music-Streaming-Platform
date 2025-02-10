package com.omar.user_service.services;

import com.omar.user_service.entity.User;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Optional;

public interface UserService {

    Optional<User> getOneByEmail(String userEmail);

    void save(User user);

    public User getAuthenticatedCustomerWithSync(Jwt oauth2User, boolean forceResync);
}
