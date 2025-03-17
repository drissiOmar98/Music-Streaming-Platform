package com.omar.playlist_service.service;

import com.omar.playlist_service.client.song.ReadSongInfoDTO;
import com.omar.playlist_service.dto.AddSongToPlaylistRequest;
import com.omar.playlist_service.dto.PlaylistRequest;
import com.omar.playlist_service.dto.PlaylistResponse;
import com.omar.playlist_service.dto.RemoveSongFromPlaylistRequest;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Set;

public interface PlaylistService {

    Long createPlaylist(PlaylistRequest request, Authentication authentication);

    Long updatePlaylist(Long id, PlaylistRequest request, Authentication authentication);

    void deletePlaylist(Long id, Authentication authentication);

    List<PlaylistResponse> getAllPlaylistsByUser(Authentication authentication);

    Set<ReadSongInfoDTO> getSongsInPlaylist(Long playlistId, Authentication authentication);

    PlaylistResponse getPlaylistById(Long id, Authentication authentication);

    void addSongToPlaylist(AddSongToPlaylistRequest request, Authentication authentication);

    void removeSongFromPlaylist(RemoveSongFromPlaylistRequest request, Authentication authentication);

    void clearPlaylist(Long playlistId, Authentication authentication);

    void reorderSongsInPlaylist(Long playlistId, List<Long> newOrder, Authentication authentication);

    boolean isSongInPlaylist(Long playlistId, Long songId, Authentication authentication);
}
