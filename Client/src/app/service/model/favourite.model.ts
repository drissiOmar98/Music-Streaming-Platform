import {ReadSong} from "./song.model";


export interface favouriteRequest {
  songId: number;
}

export interface Favourite {
  userId: string;
  songIdId: number;
  songDetails: ReadSong
}
