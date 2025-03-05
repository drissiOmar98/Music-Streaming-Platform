package com.omar.favorites_service.service;

import com.omar.favorites_service.dto.FavouriteRequest;
import com.omar.favorites_service.dto.FavouriteResponse;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface FavouriteService {

    void addToFavourites(FavouriteRequest request, Authentication authentication);

    void removeFromFavourites(Long songId, Authentication authentication);

    List<FavouriteResponse> getWishlist(Authentication authentication);

    void clearFavourites(Authentication authentication);

    boolean isFavourite(Long songId, Authentication authentication);
}
