package com.omar.favorites_service.service.Impl;

import com.omar.favorites_service.client.song.ReadSongInfoDTO;
import com.omar.favorites_service.client.song.SongClient;
import com.omar.favorites_service.client.user.UserResponse;
import com.omar.favorites_service.dto.FavouriteRequest;
import com.omar.favorites_service.dto.FavouriteResponse;
import com.omar.favorites_service.exception.FavouriteAlreadyExistsException;
import com.omar.favorites_service.exception.FavouriteNotFoundException;
import com.omar.favorites_service.exception.SongNotFoundException;
import com.omar.favorites_service.mapper.FavouriteMapper;
import com.omar.favorites_service.model.Favourite;
import com.omar.favorites_service.repository.FavoriteRepository;
import com.omar.favorites_service.service.FavouriteService;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavouriteServiceImpl implements FavouriteService {

    private final FavoriteRepository favoriteRepository;
    private final FavouriteMapper favouriteMapper;
    private final SongClient songClient;

    public FavouriteServiceImpl(FavoriteRepository favoriteRepository, FavouriteMapper favouriteMapper, SongClient songClient) {
        this.favoriteRepository = favoriteRepository;
        this.favouriteMapper = favouriteMapper;
        this.songClient = songClient;
    }

    private static final String SONG_ID_MSG = "Song with ID";


    @Override
    public void addToFavourites(FavouriteRequest request, Authentication authentication) {

        UserResponse user = getAuthenticatedCustomer(authentication);

        try {
            songClient.getSongInfo(request.songId());
        } catch (Exception e) {
            throw new SongNotFoundException(SONG_ID_MSG + request.songId() + " does not exist.");
        }

        boolean exists = favoriteRepository.existsByUserIdAndSongId(user.id(), request.songId());
        if (exists) {
            throw new FavouriteAlreadyExistsException(SONG_ID_MSG + request.songId() + " is already in the user's favourites.");
        }

        Favourite favourite = favouriteMapper.toEntity(request, user.id());
        favoriteRepository.save(favourite);

    }

    @Override
    public void removeFromFavourites(Long songId, Authentication authentication) {
        UserResponse user = getAuthenticatedCustomer(authentication);

        Favourite favourite = favoriteRepository.findByUserIdAndSongId(user.id(), songId)
                .orElseThrow(() -> new FavouriteNotFoundException(SONG_ID_MSG + songId + " not found in the user's favourites."));

        favoriteRepository.delete(favourite);

    }

    @Override
    public List<FavouriteResponse> getWishlist(Authentication authentication) {

        UserResponse user = getAuthenticatedCustomer(authentication);
        List<Favourite> favourites = favoriteRepository.findByUserId(user.id());
        return favourites.stream()
                .map(favourite -> {
                    ReadSongInfoDTO readSongInfoDTO = songClient.getSongInfo(favourite.getSongId());
                    return favouriteMapper.toFavouriteResponse(favourite, readSongInfoDTO);
                })
                .collect(Collectors.toList());
    }

    @Override
    public void clearFavourites(Authentication authentication) {
        // Get the authenticated customer's information
        UserResponse user = getAuthenticatedCustomer(authentication);

        // Find all favourites for this user
        List<Favourite> favourites = favoriteRepository.findByUserId(user.id());

        // Check if the user has any favourites, then delete them
        if (favourites.isEmpty()) {
            throw new FavouriteNotFoundException("No favourites found for the user.");
        }
        // Delete all favourites for the authenticated user
        favoriteRepository.deleteAll(favourites);

    }

    @Override
    public boolean isFavourite(Long songId, Authentication authentication) {
        UserResponse user = getAuthenticatedCustomer(authentication);
        return favoriteRepository.existsByUserIdAndSongId(user.id(), songId);

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
