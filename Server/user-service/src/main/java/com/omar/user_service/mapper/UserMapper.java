package com.omar.user_service.mapper;


import com.omar.user_service.entity.Authority;
import com.omar.user_service.entity.Subscription;
import com.omar.user_service.entity.User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserMapper {

    public User fromTokenAttributes(Map<String, Object> attributes, List<String> rolesFromAccessToken) {

        String sub = String.valueOf(attributes.get("sub"));
        String username = getAttribute(attributes, "preferred_username");
        if (username != null) {
            username = username.toLowerCase();
        }

        String firstName = extractFirstName(attributes);
        String lastName = extractLastName(attributes);
        String email = extractEmail(attributes, sub, username);
        String imageUrl = extractImageUrl(attributes);

        Set<Authority> authorities = rolesFromAccessToken
                .stream()
                .map(Authority::new)
                .collect(Collectors.toSet());

        return User.builder()
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .imageUrl(imageUrl)
                .authorities(authorities)
                .subscription(Subscription.FREE)
                .build();
    }

    private static String getAttribute(Map<String, Object> attributes, String key) {
        return attributes.containsKey(key) ? attributes.get(key).toString() : null;
    }

    private static String extractFirstName(Map<String, Object> attributes) {
        String givenName = getAttribute(attributes, "given_name");
        String nickname = getAttribute(attributes, "nickname");
        return givenName != null ? givenName : nickname;
    }

    private static String extractLastName(Map<String, Object> attributes) {
        return getAttribute(attributes, "family_name");
    }

    private static String extractEmail(Map<String, Object> attributes, String sub, String username) {
        String email = getAttribute(attributes, "email");
        if (email != null) {
            return email;
        } else if (sub.contains("|") && username != null && username.contains("@")) {
            return username;
        } else {
            return sub;
        }
    }

    private static String extractImageUrl(Map<String, Object> attributes) {
        return getAttribute(attributes, "image_url");
    }


}
