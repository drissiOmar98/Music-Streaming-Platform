package com.omar.artist_service.repositories;

import com.omar.artist_service.model.Artist;
import com.omar.artist_service.model.ArtistPicture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtistPictureRepository extends JpaRepository<ArtistPicture, Long> {
    void deleteByArtist(Artist artist);
}
