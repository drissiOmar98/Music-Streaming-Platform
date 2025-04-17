package com.omar.event_service.repository;

import com.omar.event_service.model.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    @Query("SELECT event" +
            " from Event event " +
            "LEFT JOIN FETCH event.pictures picture" +
            " WHERE picture.isCover = true ")
    Page<Event> findAllWithCoverOnly(Pageable pageable);


    @Query("SELECT event " +
            "FROM Event event " +
            "LEFT JOIN FETCH event.pictures picture " +
            "WHERE :artistId MEMBER OF event.artistIds " +
            "AND picture.isCover = true ")
    Page<Event> findByArtistIdsContaining(@Param("artistId") Long artistId, Pageable pageable);



}
