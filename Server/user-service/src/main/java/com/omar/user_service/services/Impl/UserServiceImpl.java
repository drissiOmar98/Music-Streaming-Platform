package com.omar.user_service.services.Impl;

import com.omar.user_service.entity.User;
import com.omar.user_service.mapper.UserMapper;
import com.omar.user_service.repository.UserRepository;
import com.omar.user_service.services.UserService;
import com.omar.user_service.shared.AuthenticatedUser;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {


    private final UserRepository userRepository;
    private final UserMapper userMapper;


    private static final String UPDATE_AT_KEY = "updated_at";

    @Override
    public Optional<User> getOneByEmail(String userEmail) {
        return userRepository.findByEmail(userEmail);
    }

    @Override
    public void save(User user) {
        if (user.getId() != null) { // Check if the user has an ID (for updates)
            Optional<User> userToUpdateOpt = userRepository.findById(user.getId());
            if (userToUpdateOpt.isPresent()) {
                User userToUpdate = userToUpdateOpt.get();
                userToUpdate.updateFromUser(user); // Update the fields
                userRepository.save(userToUpdate); // Save the updated entity
            }
        } else {
            userRepository.save(user); // Save the new user
        }

    }

    @Override
    @Transactional
    public User getAuthenticatedCustomerWithSync(Jwt oauth2User, boolean forceResync) {
        syncWithIdp(oauth2User, forceResync); // Sync with Keycloak directly here
        return userRepository.findByEmail(AuthenticatedUser.username().get()).orElseThrow();
    }

    /**
     * Sync user information with Keycloak
     *
     * @param jwtToken   The JWT token from Keycloak
     * @param forceResync Whether to force resynchronization
     */
    private void syncWithIdp(Jwt jwtToken, boolean forceResync) {
        Map<String, Object> attributes = jwtToken.getClaims();
        List<String> rolesFromToken = AuthenticatedUser.extractRolesFromToken(jwtToken);
        User customer = userMapper.fromTokenAttributes(attributes, rolesFromToken);
        Optional<User> existingCustomer = userRepository.findByEmail(customer.getEmail());

        if (existingCustomer.isPresent()) {
            if (attributes.get(UPDATE_AT_KEY) != null) {
                Instant lastModifiedDate = existingCustomer.orElseThrow().getLastModifiedDate();
                Instant idpModifiedDate;
                if (attributes.get(UPDATE_AT_KEY) instanceof Instant instant) {
                    idpModifiedDate = instant;
                } else {
                    idpModifiedDate = Instant.ofEpochSecond((Integer) attributes.get(UPDATE_AT_KEY));
                }
                if (idpModifiedDate.isAfter(lastModifiedDate) || forceResync) {
                    updateCustomer(customer, existingCustomer.get());
                }
            }
        } else {
            // Handle new User registration
            save(customer);
        }
    }

    private void updateCustomer(User customer, User existingCustomer) {
        existingCustomer.updateFromUser(customer);
        userRepository.save(existingCustomer);
    }



}
