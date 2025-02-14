package com.omar.artist_service.services.Impl;


import com.omar.artist_service.dto.PictureDTO;
import com.omar.artist_service.mapper.ArtistPictureMapper;
import com.omar.artist_service.model.Artist;
import com.omar.artist_service.model.ArtistPicture;
import com.omar.artist_service.repositories.ArtistPictureRepository;
import com.omar.artist_service.services.PictureService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
public class PictureServiceImpl implements PictureService {

    private final ArtistPictureRepository artistPictureRepository;

    private final ArtistPictureMapper artistPictureMapper;

    public PictureServiceImpl(ArtistPictureRepository artistPictureRepository, ArtistPictureMapper artistPictureMapper) {
        this.artistPictureRepository = artistPictureRepository;
        this.artistPictureMapper = artistPictureMapper;
    }


    /**
     * Saves all pictures associated with a artist and marks the first picture as the cover.
     *
     * @param pictures List of PictureDTO objects to be converted and saved.
     * @param artist The artist associated with the pictures.
     * @return List of PictureDTO objects after saving them as ArtistPicture entities.
     */

    @Override
    public List<PictureDTO> saveAll(List<PictureDTO> pictures, Artist artist) {

        Set<ArtistPicture> productPictures = artistPictureMapper.pictureDTOsToArtistPictures(pictures);
        boolean isFirst = true;

        for (ArtistPicture artistPicture : productPictures) {
            artistPicture.setCover(isFirst);
            artistPicture.setArtist(artist);
            isFirst = false;
        }

        artistPictureRepository.saveAll(productPictures);

        return artistPictureMapper.artistPictureToPictureDTO(productPictures.stream().toList());
    }

    @Override
    @Transactional
    public void deleteAllByArtist(Artist artist) {
        artistPictureRepository.deleteByArtist(artist);
    }

    @Override
    @Transactional
    public void updatePictures(Artist artist, List<PictureDTO> pictures) {
        deleteAllByArtist(artist);
        saveAll(pictures, artist);
    }
}
