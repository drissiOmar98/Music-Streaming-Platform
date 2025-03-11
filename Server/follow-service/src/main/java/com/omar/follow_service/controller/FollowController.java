package com.omar.follow_service.controller;

import com.omar.follow_service.dto.FollowRequest;
import com.omar.follow_service.dto.FollowResponse;
import com.omar.follow_service.service.FollowService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/follows")
public class FollowController {

    private final FollowService followService;

    public FollowController(FollowService followService) {
        this.followService = followService;
    }

    @PostMapping
    public ResponseEntity<Void> followArtist(@RequestBody @Valid FollowRequest request, Authentication authentication) {
        followService.followArtist(request, authentication);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{artistId}")
    public ResponseEntity<Void> unfollowArtist(@PathVariable Long artistId, Authentication authentication) {
        followService.unfollowArtist(artistId, authentication);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<FollowResponse>> getFollowedArtists(Authentication authentication) {
        return ResponseEntity.ok(followService.getFollowedArtists(authentication));
    }

    @GetMapping("/is-following/{artistId}")
    public ResponseEntity<Boolean> isFollowing(@PathVariable Long artistId, Authentication authentication) {
        return ResponseEntity.ok(followService.isFollowing(artistId, authentication));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearFollowers(Authentication authentication) {
        followService.clearFollowers(authentication);
        return ResponseEntity.noContent().build();
    }




}
