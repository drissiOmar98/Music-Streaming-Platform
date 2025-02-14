package com.omar.artist_service.services.Impl;

import com.omar.artist_service.dto.ArtistRequest;
import com.omar.artist_service.dto.DisplayArtistDTO;
import com.omar.artist_service.dto.DisplayCardArtistDTO;
import com.omar.artist_service.exception.ArtistNotFoundException;
import com.omar.artist_service.mapper.ArtistMapper;
import com.omar.artist_service.model.Artist;
import com.omar.artist_service.repositories.ArtistRepository;
import com.omar.artist_service.services.ArtistService;
import com.omar.artist_service.services.PictureService;
import com.omar.artist_service.shared.state.State;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class ArtistServiceImpl implements ArtistService {

    private final PictureService pictureService;

    private final ArtistRepository artistRepository;

    private final ArtistMapper artistMapper;

    public ArtistServiceImpl(PictureService pictureService, ArtistRepository artistRepository, ArtistMapper artistMapper) {
        this.pictureService = pictureService;
        this.artistRepository = artistRepository;
        this.artistMapper = artistMapper;
    }

    private static final String ARTIST_NOT_FOUND_MESSAGE = "Artist not found with ID: ";

    @Override
    public Long createArtist(ArtistRequest request) {
        var artist = artistMapper.toArtist(request);
        artist = artistRepository.save(artist);
        // Delegate picture handling to PictureService
        if (request.pictures() != null && !request.pictures().isEmpty()) {
            pictureService.saveAll(request.pictures(), artist);
        }
        return artist.getId();
    }

    @Override
    public void deleteArtist(Long artistId) {
        Artist artist = artistRepository.findById(artistId)
                .orElseThrow(() -> new ArtistNotFoundException(ARTIST_NOT_FOUND_MESSAGE + artistId));
        pictureService.deleteAllByArtist(artist);
        artistRepository.delete(artist);
    }

    @Override
    public void updateArtist(Long artistId, ArtistRequest request) {
        Artist artist = artistRepository.findById(artistId)
                .orElseThrow(() -> new ArtistNotFoundException(ARTIST_NOT_FOUND_MESSAGE + artistId));
        // Update name and bio if provided
        if (request.infos() != null) {
            if (request.infos().name() != null && !request.infos().name().isBlank()) {
                artist.setName(request.infos().name());
            }
            if (request.infos().bio() != null && !request.infos().bio().isBlank()) {
                artist.setBio(request.infos().bio());
            }
        }
        // Update pictures if provided
        if (request.pictures() != null && !request.pictures().isEmpty()) {
            pictureService.updatePictures(artist, request.pictures());
        }
        artistRepository.save(artist);
    }

    @Override
    public Boolean existsById(Long artistId) {
        return artistRepository.findById(artistId).isPresent();
    }

    @Override
    public Page<DisplayCardArtistDTO> getAllArtists(Pageable pageable) {
        Page<Artist> artists = artistRepository.findAllWithCoverOnly(pageable);
        return artists.map(artistMapper::artistToDisplayCardArtistDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public State<DisplayArtistDTO, String> getOne(Long artistId) {
        Optional<Artist> artistIdById = artistRepository.findById(artistId);
        if (artistIdById.isEmpty()) {
            return State.<DisplayArtistDTO, String>builder()
                    .forError(String.format("product doesn't with this Id: %s", artistId));
        }
        DisplayArtistDTO displayProductDTO = artistMapper.artistToDisplayArtistDTO(artistIdById.get());
        return State.<DisplayArtistDTO , String>builder().forSuccess(displayProductDTO);
    }

    @Override
    public DisplayCardArtistDTO getArtistDetailsWithCover(Long artistId) {
        Artist artist = artistRepository.findArtistWithCoverOnly(artistId)
                .orElseThrow(() -> new ArtistNotFoundException(ARTIST_NOT_FOUND_MESSAGE + artistId));
        return artistMapper.artistToDisplayCardArtistDTO(artist);
    }
}
