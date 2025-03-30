package com.omar.event_service.services.Impl;



import com.omar.event_service.dto.common.PictureDTO;
import com.omar.event_service.mapper.EventPictureMapper;
import com.omar.event_service.model.Event;
import com.omar.event_service.model.EventPicture;
import com.omar.event_service.repository.EventPictureRepository;
import com.omar.event_service.services.PictureService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
public class PictureServiceImpl implements PictureService {

    private final EventPictureRepository eventPictureRepository;

    private final EventPictureMapper eventPictureMapper;

    public PictureServiceImpl(EventPictureRepository eventPictureRepository, EventPictureMapper eventPictureMapper) {
        this.eventPictureRepository = eventPictureRepository;
        this.eventPictureMapper = eventPictureMapper;
    }


    /**
     * Saves all pictures associated with a artist and marks the first picture as the cover.
     *
     * @param pictures List of PictureDTO objects to be converted and saved.
     * @param event The event associated with the pictures.
     * @return List of PictureDTO objects after saving them as EventPicture entities.
     */

    @Override
    public List<PictureDTO> saveAll(List<PictureDTO> pictures, Event event) {

        Set<EventPicture> eventPictures = eventPictureMapper.pictureDTOsToArtistPictures(pictures);
        boolean isFirst = true;

        for (EventPicture eventPicture: eventPictures) {
            eventPicture.setCover(isFirst);
            eventPicture.setEvent(event);
            isFirst = false;
        }

        eventPictureRepository.saveAll(eventPictures);

        return eventPictureMapper.eventPictureToPictureDTO(eventPictures.stream().toList());
    }

    @Override
    @Transactional
    public void deleteAllByEvent(Event event) {
        eventPictureRepository.deleteByEvent(event);
    }

    @Override
    @Transactional
    public void updatePictures(Event event, List<PictureDTO> pictures) {
        deleteAllByEvent(event);
        saveAll(pictures, event);
    }
}
