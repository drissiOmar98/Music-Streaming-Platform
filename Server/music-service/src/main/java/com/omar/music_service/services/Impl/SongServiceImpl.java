package com.omar.music_service.services.Impl;

import com.omar.music_service.dto.ReadSongInfoDTO;
import com.omar.music_service.dto.SongContentDTO;
import com.omar.music_service.dto.SongDetailsResponse;
import com.omar.music_service.dto.SongRequestDTO;
import com.omar.music_service.entities.Song;
import com.omar.music_service.entities.SongContent;
import com.omar.music_service.mapper.SongContentMapper;
import com.omar.music_service.mapper.SongMapper;
import com.omar.music_service.repository.SongContentRepository;
import com.omar.music_service.repository.SongRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SongServiceImpl implements SongService {

    private final SongRepository songRepository;
    private final SongContentRepository songContentRepository;
    private final SongMapper songMapper;
    private final SongContentMapper songContentMapper;

    public SongServiceImpl(SongRepository songRepository, SongContentRepository songContentRepository, SongMapper songMapper, SongContentMapper songContentMapper) {
        this.songRepository = songRepository;
        this.songContentRepository = songContentRepository;
        this.songMapper = songMapper;
        this.songContentMapper = songContentMapper;
    }


    @Override
    public Long create(SongRequestDTO songRequestDTO) {
        Song song = songMapper.toSong(songRequestDTO);
        Song songSaved = songRepository.save(song);

        SongContent songContent = songContentMapper.saveSongDTOToSong(songRequestDTO);
        songContent.setSong(songSaved);

        songContentRepository.save(songContent);
        return songSaved.getId();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReadSongInfoDTO> getAll() {
        return songRepository.findAll().stream()
                .map(songMapper::songToReadSongInfoDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReadSongInfoDTO> getSongsByArtistId(Long artistId) {
        return songRepository.findByArtistId(artistId).stream()
                .map(songMapper::songToReadSongInfoDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<SongContentDTO> getOneById(Long songId) {
        return songContentRepository.findById(songId)
                .map(songContentMapper::songContentToSongContentDTO);
    }

    @Override
    @Transactional
    public void delete(Long songId) {
        songContentRepository.deleteById(songId);
        songRepository.deleteById(songId);
    }

    @Override
    public Optional<SongDetailsResponse> getSongDetails(Long songId) {
        return songRepository.findById(songId)
                .map(song -> {
                    // Map song to ReadSongInfoDTO
                    ReadSongInfoDTO songInfo = songMapper.songToReadSongInfoDTO(song);

                    // Fetch song content
                    SongContentDTO songContent = songContentRepository.findById(songId)
                            .map(songContentMapper::songContentToSongContentDTO)
                            .orElse(null);

                    // Return combined response
                    return new SongDetailsResponse(songInfo, songContent);
                });
    }

}
