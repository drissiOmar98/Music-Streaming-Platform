package com.omar.follow_service.service;

import com.omar.follow_service.dto.FollowRequest;
import com.omar.follow_service.dto.FollowResponse;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface FollowService {

    void followArtist(FollowRequest request, Authentication authentication);
    void unfollowArtist(Long artistId, Authentication authentication);
    List<FollowResponse> getFollowedArtists(Authentication authentication);
    boolean isFollowing(Long artistId, Authentication authentication);
    void clearFollowers(Authentication authentication);
}
