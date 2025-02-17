import {NewArtistPicture} from "./picture.model";

export interface NewArtist {
  id?: number;
  infos: NewArtistInfo,
  pictures: Array<NewArtistPicture>,
}

export interface NewArtistInfo {
  name: string;
  bio: string;
}

export interface CardArtist {
  id: number;
  name: string;
  bio: string;
  cover: DisplayPicture;
}

export interface DisplayPicture {
  file?: string,
  fileContentType?: string,
  isCover?: boolean
}

export interface CreatedArtist {
  id: number;
}

export interface Artist {
  id: number;
  name: string;
  bio: string;
  pictures: Array<DisplayPicture>;

}





