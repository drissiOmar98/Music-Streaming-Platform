package com.omar.favorites_service.controller;

import com.omar.favorites_service.dto.FavouriteRequest;
import com.omar.favorites_service.dto.FavouriteResponse;
import com.omar.favorites_service.service.FavouriteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/favourites")
public class FavouriteController {

    private final FavouriteService favouriteService;

    public FavouriteController(FavouriteService favouriteService) {
        this.favouriteService = favouriteService;
    }

    @PostMapping
    public ResponseEntity<Void> addToFavourites(@RequestBody @Valid FavouriteRequest request, Authentication authentication) {
        favouriteService.addToFavourites(request, authentication);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{songId}")
    public ResponseEntity<Void> removeFromFavourites(@PathVariable Long songId, Authentication authentication) {
        favouriteService.removeFromFavourites(songId, authentication);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<FavouriteResponse>> getWishlist(Authentication authentication) {
        return ResponseEntity.ok(favouriteService.getWishlist(authentication));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearFavourites(Authentication authentication) {
        favouriteService.clearFavourites(authentication);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/is-favourite/{songId}")
    public ResponseEntity<Boolean> isFavourite(@PathVariable Long songId, Authentication authentication) {
        return ResponseEntity.ok(favouriteService.isFavourite(songId, authentication));
    }




}
