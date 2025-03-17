package com.omar.playlist_service.service.Impl;

import com.omar.playlist_service.client.song.ReadSongInfoDTO;
import com.omar.playlist_service.client.song.SongClient;
import com.omar.playlist_service.dto.AddSongToPlaylistRequest;
import com.omar.playlist_service.dto.PlaylistRequest;
import com.omar.playlist_service.dto.PlaylistResponse;
import com.omar.playlist_service.dto.RemoveSongFromPlaylistRequest;
import com.omar.playlist_service.exception.*;
import com.omar.playlist_service.mapper.PlaylistMapper;
import com.omar.playlist_service.model.Playlist;
import com.omar.playlist_service.repository.PlaylistRepository;
import com.omar.playlist_service.service.PlaylistService;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PlaylistServiceImpl implements PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final SongClient songClient;
    private final PlaylistMapper playlistMapper;

    public PlaylistServiceImpl(PlaylistRepository playlistRepository, SongClient songClient, PlaylistMapper playlistMapper) {
        this.playlistRepository = playlistRepository;
        this.songClient = songClient;
        this.playlistMapper = playlistMapper;
    }

    @Override
    public Long createPlaylist(PlaylistRequest request, Authentication authentication) {

        String userId = getAuthenticatedUserId(authentication);

        // Check if a playlist with the same title already exists for the user
        if (playlistRepository.existsByUserIdAndTitle(userId, request.title())) {
            throw new PlaylistAlreadyExistsException("A playlist with the title '" + request.title() + "' already exists.");
        }

        // Validate song IDs (if provided)
        if (request.songIds() != null && !request.songIds().isEmpty()) {
            validateSongIds(request.songIds());
        }

        var playlist = playlistMapper.toEntity(request, userId);
        playlist = playlistRepository.save(playlist);
        return playlist.getId();
    }

    private void validateSongIds(Set<Long> songIds) {
        for (Long songId : songIds) {
            try {
                songClient.getSongInfo(songId);
            } catch (Exception e) {
                throw new SongNotFoundException("Song not found with ID: " + songId);
            }
        }
    }

    @Override
    public Long updatePlaylist(Long id, PlaylistRequest request, Authentication authentication) {

        String userId = getAuthenticatedUserId(authentication);

        // Fetch the playlist and check if it exists
        Playlist playlist = playlistRepository.findById(id)
                .orElseThrow(() -> new PlaylistNotFoundException("Playlist with ID " + id + " not found."));

        // Check if the user has permission to update the playlist
        if (!playlist.getUserId().equals(userId)) {
            throw new UnauthorizedPlaylistAccessException("You do not have permission to update this playlist.");
        }

        // Validate song IDs (if provided)
        if (request.songIds() != null && !request.songIds().isEmpty()) {
            validateSongIds(request.songIds());
        }

        // Partial update: Only update fields that are provided in the request
        updatePlaylistFields(playlist, request);

        playlist = playlistRepository.save(playlist);
        return playlist.getId();

    }

    private void updatePlaylistFields(Playlist playlist, PlaylistRequest request) {
        if (request.title() != null) {
            playlist.setTitle(request.title());
        }
        if (request.description() != null) {
            playlist.setDescription(request.description());
        }
        if (request.cover() != null || request.coverContentType() != null) {
            if (request.cover() != null) {
                playlist.setCover(request.cover());
            }
            if (request.coverContentType() != null) {
                playlist.setCoverContentType(request.coverContentType());
            }
        }
        if (request.songIds() != null) {
            playlist.setSongIds(request.songIds());
        }
    }

    @Override
    public void deletePlaylist(Long id, Authentication authentication) {

        String userId = getAuthenticatedUserId(authentication);

        // Fetch the playlist and check if it exists
        Playlist playlist = playlistRepository.findById(id)
                .orElseThrow(() -> new PlaylistNotFoundException("Playlist with ID " + id + " not found."));

        // Check if the user has permission to delete the playlist
        if (!playlist.getUserId().equals(userId)) {
            throw new UnauthorizedPlaylistAccessException("You do not have permission to delete this playlist.");
        }

        playlistRepository.delete(playlist);
    }

    @Override
    public List<PlaylistResponse> getAllPlaylistsByUser(Authentication authentication) {
        String userId = getAuthenticatedUserId(authentication);

        // Fetch all playlists for the user
        List<Playlist> playlists = playlistRepository.findByUserId(userId);

        // Map each playlist to a PlaylistResponse
        return playlists.stream()
                .map(playlist -> {
                    Set<ReadSongInfoDTO> songs = playlist.getSongIds().stream()
                            .map(songClient::getSongInfo)
                            .collect(Collectors.toSet());
                    return playlistMapper.toPlaylistResponse(playlist, songs);
                })
                .collect(Collectors.toList());
    }

    @Override
    public Set<ReadSongInfoDTO> getSongsInPlaylist(Long playlistId, Authentication authentication) {
        String userId = getAuthenticatedUserId(authentication);

        // Fetch the playlist and ensure it belongs to the authenticated user
        Playlist playlist = playlistRepository.findByIdAndUserId(playlistId, userId)
                .orElseThrow(() -> new PlaylistNotFoundException("Playlist not found with ID: " + playlistId));

        // Fetch song details from the music-service
        return playlist.getSongIds().stream()
                .map(songClient::getSongInfo)
                .collect(Collectors.toSet());
    }

    @Override
    public PlaylistResponse getPlaylistById(Long id, Authentication authentication) {
        String userId = getAuthenticatedUserId(authentication);

        // Fetch the playlist and ensure it belongs to the authenticated user
        Playlist playlist = playlistRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new PlaylistNotFoundException("Playlist not found with ID: " + id));

        // Fetch song details from the music-service
        Set<ReadSongInfoDTO> songs = playlist.getSongIds().stream()
                .map(songClient::getSongInfo)
                .collect(Collectors.toSet());

        return playlistMapper.toPlaylistResponse(playlist, songs);
    }

    @Override
    public void addSongToPlaylist(AddSongToPlaylistRequest request, Authentication authentication) {

        String userId = getAuthenticatedUserId(authentication);

        // Fetch the playlist and ensure it belongs to the authenticated user
        Playlist playlist = playlistRepository.findByIdAndUserId(request.playlistId(), userId)
                .orElseThrow(() -> new PlaylistNotFoundException("Playlist not found with ID: " + request.playlistId()));

        // Validate the song ID
        validateSongIds(Set.of(request.songId()));

        // Add the song to the playlist
        playlist.getSongIds().add(request.songId());
        playlistRepository.save(playlist);
    }

    @Override
    public void removeSongFromPlaylist(RemoveSongFromPlaylistRequest request, Authentication authentication) {
        String userId = getAuthenticatedUserId(authentication);

        // Fetch the playlist and ensure it belongs to the authenticated user
        Playlist playlist = playlistRepository.findByIdAndUserId(request.playlistId(), userId)
                .orElseThrow(() -> new PlaylistNotFoundException("Playlist not found with ID: " + request.playlistId()));

        // Remove the song from the playlist
        playlist.getSongIds().remove(request.songId());
        playlistRepository.save(playlist);
    }

    @Override
    public void clearPlaylist(Long playlistId, Authentication authentication) {

        String userId = getAuthenticatedUserId(authentication);

        // Fetch the playlist and ensure it belongs to the authenticated user
        Playlist playlist = playlistRepository.findByIdAndUserId(playlistId, userId)
                .orElseThrow(() -> new PlaylistNotFoundException("Playlist not found with ID: " + playlistId));

        // Clear the song IDs
        playlist.getSongIds().clear();
        playlistRepository.save(playlist);

    }

    @Override
    public void reorderSongsInPlaylist(Long playlistId, List<Long> newOrder, Authentication authentication) {
        String userId = getAuthenticatedUserId(authentication);

        // Fetch the playlist and ensure it belongs to the authenticated user
        Playlist playlist = playlistRepository.findByIdAndUserId(playlistId, userId)
                .orElseThrow(() -> new PlaylistNotFoundException("Playlist not found with ID: " + playlistId));

        // Validate the new order
        if (!playlist.getSongIds().containsAll(newOrder)) {
            throw new InvalidSongOrderException("New order contains invalid song IDs.");
        }


        // Update the song order
        playlist.setSongIds(new LinkedHashSet<>(newOrder)); // Preserve order using LinkedHashSet
        playlistRepository.save(playlist);

    }

    @Override
    public boolean isSongInPlaylist(Long playlistId, Long songId, Authentication authentication) {
        String userId = getAuthenticatedUserId(authentication);

        // Fetch the playlist and ensure it belongs to the authenticated user
        Playlist playlist = playlistRepository.findByIdAndUserId(playlistId, userId)
                .orElseThrow(() -> new PlaylistNotFoundException("Playlist not found with ID: " + playlistId));

        return playlist.getSongIds().contains(songId);

    }


    private String getAuthenticatedUserId(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        return jwt.getSubject();
    }
}
