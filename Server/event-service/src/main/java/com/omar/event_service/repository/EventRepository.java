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

    @Query("SELECT event FROM Event event " +
            "LEFT JOIN FETCH event.pictures picture " +
            "WHERE event.startDateTime > :currentDate " +
            "AND  picture.isCover = true")
    Page<Event> findUpcomingEventsWithCover(@Param("currentDate") Date currentDate, Pageable pageable);

    @Query("SELECT event FROM Event event " +
            "LEFT JOIN FETCH event.pictures picture " +
            "WHERE event.endDateTime < :currentDate " +
            "AND picture.isCover = true")
    Page<Event> findPastEventsWithCover(@Param("currentDate") Date currentDate, Pageable pageable);


    @Query("SELECT e FROM Event e " +
            "LEFT JOIN FETCH e.pictures pic " +
            "WHERE pic.isCover = true " +
            "AND (LOWER(e.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(e.description) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(e.location) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Event> searchEvents(@Param("query") String query, Pageable pageable);

}
