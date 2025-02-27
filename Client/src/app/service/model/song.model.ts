// Common properties for all song-related models
import {GenreName} from "./genre.model";

export interface SongBase {
  title: string;
  artistId: number;
  genre: GenreName;
}

export interface CreatedSong {
  id: number;
}

export interface NewSongCover {
  file: File;
  urlDisplay: string;
}

// DTO for creating a new song (file upload)
export interface NewSong extends SongBase {
  file?: File; // Binary audio file
  fileContentType?: string;
  cover?: NewSongCover; // Cover image
  coverContentType?: string;
}

// DTO for reading basic song info (without content)
export interface ReadSong extends SongBase {
  id: number;
  cover?: string; // URL or Base64 string for image display
  coverContentType?: string;
  displayPlay: boolean; // Used for UI play button state
}


// DTO for reading full song content
export interface SongContent extends ReadSong {
  songId: number;
  file?: string;
  fileContentType?: string;
}


// DTO combining song info + content
export interface SongDetailsResponse {
  songInfo: ReadSong;
  songContent: SongContent;
}


export interface CreatedSong {
  id: number;
}
