package com.omar.favorites_service.repository;

import com.omar.favorites_service.model.Favourite;
import com.omar.favorites_service.model.id.FavouriteId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favourite, FavouriteId> {

    boolean existsByUserIdAndSongId(String userId, Long songId);

    Optional<Favourite> findByUserIdAndSongId(String userId, Long songId);

    List<Favourite> findByUserId(String userId);


}
