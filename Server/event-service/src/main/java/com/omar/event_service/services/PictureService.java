package com.omar.event_service.services;


import com.omar.event_service.dto.common.PictureDTO;
import com.omar.event_service.model.Event;

import java.util.List;

public interface PictureService {

    List<PictureDTO> saveAll(List<PictureDTO> pictures, Event event);

    void deleteAllByEvent(Event event);

    void updatePictures(Event event, List<PictureDTO> pictures);
}
