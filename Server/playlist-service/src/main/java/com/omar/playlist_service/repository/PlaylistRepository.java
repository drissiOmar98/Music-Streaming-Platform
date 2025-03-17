package com.omar.playlist_service.repository;

import com.omar.playlist_service.model.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Long> {

    boolean existsByUserIdAndTitle(String userId, String title);

    Optional<Playlist> findByIdAndUserId(Long id, String userId);

    List<Playlist> findByUserId(String userId);
}
