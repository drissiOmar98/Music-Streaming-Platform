package com.omar.event_participation_service.repository;

import com.omar.event_participation_service.model.EventParticipation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventParticipationRepository extends JpaRepository<EventParticipation, Long> {

    boolean existsByUserIdAndEventId(String userId, Long eventId);

    Optional<EventParticipation> findByUserIdAndEventId(String userId, Long eventId);

    List<EventParticipation> findByUserId(String userId);
}
