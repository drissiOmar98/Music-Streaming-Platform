package com.omar.event_service.repository;

import com.omar.event_service.model.EventVideo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventVideoRepository extends JpaRepository<EventVideo, Long> {

    Optional<EventVideo> findByEventId(Long id);
}
