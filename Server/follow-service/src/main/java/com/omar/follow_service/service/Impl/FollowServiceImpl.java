package com.omar.follow_service.service.Impl;

import com.omar.follow_service.client.artist.ArtistClient;
import com.omar.follow_service.client.artist.ArtistDTO;
import com.omar.follow_service.client.user.UserResponse;
import com.omar.follow_service.dto.FollowRequest;
import com.omar.follow_service.dto.FollowResponse;
import com.omar.follow_service.exception.ArtistNotFoundException;
import com.omar.follow_service.exception.FollowAlreadyExistsException;
import com.omar.follow_service.exception.FollowNotFoundException;
import com.omar.follow_service.mapper.FollowMapper;
import com.omar.follow_service.model.Follow;
import com.omar.follow_service.repository.FollowRepository;
import com.omar.follow_service.service.FollowService;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FollowServiceImpl implements FollowService {

    private final FollowRepository followRepository;
    private final FollowMapper followMapper;
    private final ArtistClient artistClient;

    public FollowServiceImpl(FollowRepository followRepository, FollowMapper followMapper, ArtistClient artistClient) {
        this.followRepository = followRepository;
        this.followMapper = followMapper;
        this.artistClient = artistClient;
    }


    @Override
    public void followArtist(FollowRequest request, Authentication authentication) {

        UserResponse user = getAuthenticatedCustomer(authentication);

        // Check if the artist exists
        try {
            artistClient.getArtistDetailsById(request.artistId());
        } catch (Exception e) {
            throw new ArtistNotFoundException("Artist with ID " + request.artistId() + " does not exist.");
        }

        // Check if the user is already following the artist
        if (followRepository.existsByUserIdAndArtistId(user.id(), request.artistId())) {
            throw new FollowAlreadyExistsException("User is already following artist with ID " + request.artistId());
        }

        Follow follow = followMapper.toEntity(request, user.id());
        followRepository.save(follow);

    }

    @Override
    public void unfollowArtist(Long artistId, Authentication authentication) {
        UserResponse user = getAuthenticatedCustomer(authentication);

        // Check if the user is following the artist
        Follow follow = followRepository.findByUserIdAndArtistId(user.id(), artistId)
                .orElseThrow(() -> new FollowNotFoundException("User is not following artist with ID " + artistId));

        followRepository.delete(follow);

    }

    @Override
    public List<FollowResponse> getFollowedArtists(Authentication authentication) {

        UserResponse user = getAuthenticatedCustomer(authentication);

        // Fetch all followed artists for the user
        List<Follow> follows = followRepository.findByUserId(user.id());
        return follows.stream()
                .map(follow -> {
                    ArtistDTO artistDetails = artistClient.getArtistDetailsById(follow.getArtistId());
                    return followMapper.toFollowResponse(follow, artistDetails);
                })
                .collect(Collectors.toList());
    }


    @Override
    public boolean isFollowing(Long artistId, Authentication authentication) {
        UserResponse user = getAuthenticatedCustomer(authentication);
        return followRepository.existsByUserIdAndArtistId(user.id(), artistId);
    }

    @Override
    public void clearFollowers(Authentication authentication) {
        UserResponse user = getAuthenticatedCustomer(authentication);

        List<Follow> follows= followRepository.findByUserId(user.id());

        if (follows.isEmpty()) {
            throw new FollowNotFoundException("No favourites found for the user.");
        }
        followRepository.deleteAll(follows);
    }


    private UserResponse getAuthenticatedCustomer(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String userId = jwt.getSubject();
        String firstName = jwt.getClaimAsString("given_name");
        String lastName = jwt.getClaimAsString("family_name");
        String email = jwt.getClaimAsString("email");

        return new UserResponse(userId, firstName, lastName, email);
    }
}
