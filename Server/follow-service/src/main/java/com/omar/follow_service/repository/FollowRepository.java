package com.omar.follow_service.repository;

import com.omar.follow_service.model.Follow;
import com.omar.follow_service.model.id.FollowId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, FollowId> {

    boolean existsByUserIdAndArtistId(String userId, Long artistId);

    Optional<Follow> findByUserIdAndArtistId(String userId, Long artistId);

    List<Follow> findByUserId(String userId);

}
