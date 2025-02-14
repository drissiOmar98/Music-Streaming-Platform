package com.omar.artist_service.services;


import com.omar.artist_service.dto.PictureDTO;
import com.omar.artist_service.model.Artist;

import java.util.List;

public interface PictureService {

    List<PictureDTO> saveAll(List<PictureDTO> pictures, Artist artist);

    void deleteAllByArtist(Artist artist);

    void updatePictures(Artist artist, List<PictureDTO> pictures);
}
