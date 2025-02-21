import { Injectable } from '@angular/core';
import {Genre, GenreName} from "./model/genre.model";
import {BehaviorSubject} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class GenreService {

  private genres: Genre[] = [
    { icon: "music", displayName: "All", technicalName: "ALL", activated: false },
    { icon: "compact-disc", displayName: "Pop", technicalName: "POP", activated: false },
    { icon: "guitar", displayName: "Rock", technicalName: "ROCK", activated: false },
    { icon: "record-vinyl", displayName: "Jazz", technicalName: "JAZZ", activated: false },
    { icon: "headphones", displayName: "Hip-Hop", technicalName: "HIP_HOP", activated: false },
    { icon: "broadcast-tower", displayName: "Electronic", technicalName: "ELECTRONIC", activated: false },
    { icon: "book", displayName: "Classical", technicalName: "CLASSICAL", activated: false },
    { icon: "skull", displayName: "Metal", technicalName: "METAL", activated: false },
    { icon: "heart", displayName: "R&B", technicalName: "RNB", activated: false },
    { icon: "sun", displayName: "Reggae", technicalName: "REGGAE", activated: false },
    { icon: "hat-cowboy", displayName: "Country", technicalName: "COUNTRY", activated: false },
    { icon: "music", displayName: "Blues", technicalName: "BLUES", activated: false },
    { icon: "drum", displayName: "Latin", technicalName: "LATIN", activated: false },
    { icon: "leaf", displayName: "Folk", technicalName: "FOLK", activated: false },
    { icon: "fire", displayName: "Soul", technicalName: "SOUL", activated: false },
    { icon: "star", displayName: "Funk", technicalName: "FUNK", activated: false }
  ];

  private changeGenre$ = new BehaviorSubject<Genre>(this.getGenreByDefault());

  changeGenreObs = this.changeGenre$.asObservable();

  changeGenre(category: Genre): void {
    this.changeGenre$.next(category);
  }

  getGenres(): Genre[] {
    return this.genres;
  }


  getGenreByDefault() {
    return this.genres[0];
  }

  getGenreByTechnicalName(technicalName: GenreName): Genre | undefined {
    return this.genres.find(genre => genre.technicalName === technicalName);
  }



  constructor() { }
}
