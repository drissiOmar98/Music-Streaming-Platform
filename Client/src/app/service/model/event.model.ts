import {CardArtist, DisplayPicture} from "./artist.model";
import {NewEventPicture} from "./picture.model";


export interface CreatedEvent {
  id: number;
}

export interface NewEvent {
  infos: NewEventInfo,
  video: EventVideo,
  location: string,
  pictures: Array<NewEventPicture>,
  dateRange: DateRange,
  artistIds: number[] // Array of artist IDs
}

export interface NewEventInfo {
  title: string,
  description: string
}

export interface DateRange {
  startDateTime: Date;
  endDateTime: Date;
}

export interface EventVideo {
  eventId?: number;
  file?: File;
  fileContentType?: string;
  videoUrl?: string;
}

export interface CardEvent {
  id: number;
  title: string;
  location: string;
  startDateTime: Date;
  endDateTime: Date;
  cover: DisplayPicture;
  artists: CardArtist[];
}

export interface Event extends CardEvent {
  description: string;
  pictures: DisplayPicture[];
}




