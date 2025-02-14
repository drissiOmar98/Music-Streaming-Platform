package com.omar.artist_service.services;


import com.omar.artist_service.dto.ArtistRequest;
import com.omar.artist_service.dto.DisplayArtistDTO;
import com.omar.artist_service.dto.DisplayCardArtistDTO;
import com.omar.artist_service.shared.state.State;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;



public interface ArtistService {

    Long createArtist(ArtistRequest request);

    void deleteArtist(Long artistId);

    void updateArtist(Long artistId, ArtistRequest request);

    Boolean existsById(Long artistId);

    Page<DisplayCardArtistDTO> getAllArtists(Pageable pageable);

    public State<DisplayArtistDTO, String> getOne(Long artistIdId);

    DisplayCardArtistDTO getArtistDetailsWithCover(Long artistId);



}
