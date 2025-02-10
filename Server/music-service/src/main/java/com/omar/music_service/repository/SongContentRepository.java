package com.omar.music_service.repository;

import com.omar.music_service.entities.SongContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SongContentRepository extends JpaRepository<SongContent, Long> {
}
