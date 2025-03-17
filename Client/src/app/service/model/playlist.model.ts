import {ReadSong} from "./song.model";

export interface NewPlaylistCover {
  file: File;
  urlDisplay: string;
}

export interface NewPlaylist  {
  title: string;
  description?: string;
  cover?: NewPlaylistCover; // Cover image
  coverContentType?: string;
  songIds?: number[]; // Array of song IDs
}

export interface Playlist {
  id: number;
  title: string;
  description?: string;
  cover?: string | null; // Base64 encoded image or URL
  coverContentType?: string | null;
  songs?: ReadSong[]; // Array of song details
}

export interface AddSongToPlaylistRequest {
  playlistId: number;
  songId: number;
}

export interface RemoveSongFromPlaylistRequest {
  playlistId: number;
  songId: number;
}


export interface CreatedPlaylist {
  id: number;
}
