
import {CardArtist} from "./artist.model";


export interface FollowRequest {
  artistId: number;
}

export interface Follow {
  userId: string;
  artistId: number;
  artistDetails: CardArtist
}
