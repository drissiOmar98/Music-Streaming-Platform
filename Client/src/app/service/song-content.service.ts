import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {ReadSong, SongContent} from "./model/song.model";
import {State} from "../shared/model/state.model";
import {environment} from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class SongContentService {

  http = inject(HttpClient);

  private queueToPlay$: WritableSignal<Array<ReadSong>> = signal([]);
  queueToPlay = computed(() => this.queueToPlay$());

  private play$ : WritableSignal<State<SongContent>> =
    signal(State.Builder<SongContent>().forInit());
  playNewSong = computed(() => this.play$());

  createNewQueue(firstSong: ReadSong, songsToPlay: Array<ReadSong>): void {
    songsToPlay = songsToPlay.filter(song => song.id !== firstSong.id);
    if(songsToPlay) {
      songsToPlay.unshift(firstSong);
    }
    this.queueToPlay$.set(songsToPlay);
  }

  fetchNextSong(songToPlay: SongContent) : void {
    const queryParam = new HttpParams().set('songId', songToPlay.songId!);
    this.http.get<SongContent>(`${environment.API_URL}/songs/get-content`, {params: queryParam})
      .subscribe({
        next: songContent => {
          this.mapReadSongToSongContent(songContent, songToPlay);
          this.play$.set(State.Builder<SongContent>().forSuccess(songContent))
        },
        error: err => this.play$.set(State.Builder<SongContent>().forError(err))
      })
  }

  constructor() { }

  private mapReadSongToSongContent(songContent: SongContent, songToPlay: ReadSong) {
    songContent.cover = songToPlay.cover;
    songContent.coverContentType = songToPlay.coverContentType;
    songContent.title = songToPlay.title;
    // songContent.author = songToPlay.author;
    // songContent.favorite = songToPlay.favorite;
  }
}
