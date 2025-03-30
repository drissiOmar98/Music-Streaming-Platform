package com.omar.event_service.repository;


import com.omar.event_service.model.Event;
import com.omar.event_service.model.EventPicture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventPictureRepository extends JpaRepository<EventPicture, Long> {
   void deleteByEvent(Event event);
}
