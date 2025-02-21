import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";

import {State} from "../shared/model/state.model";
import {CreatedSong, NewSong, ReadSong} from "./model/song.model";
import {CreatedArtist, NewArtist} from "./model/artist.model";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SongService {

  http = inject(HttpClient);

  private add$: WritableSignal<State<CreatedSong>> = signal(State.Builder<CreatedSong>().forInit());
  addSig = computed(() => this.add$());

  private getAll$: WritableSignal<State<Array<ReadSong>>> =
    signal(State.Builder<Array<ReadSong>, HttpErrorResponse>().forInit());
  getAllSig = computed(() => this.getAll$());

  add(newSong: NewSong): void {
    const formData = new FormData();
    formData.append('cover', newSong.cover?.file!);
    formData.append('file', newSong.file!);
    const clone = structuredClone(newSong);
    clone.file = undefined;
    clone.cover = undefined;
    formData.append("dto", JSON.stringify(clone));
    this.http.post<CreatedArtist>(`${environment.API_URL}/songs/add`,
      formData).subscribe({
      next: song => this.add$.set(State.Builder<CreatedArtist>().forSuccess(song)),
      error: err => this.add$.set(State.Builder<CreatedArtist>().forError(err)),
    });
  }

  getAll(): void {
    this.http.get<Array<ReadSong>>(`${environment.API_URL}/songs/all`)
      .subscribe({
        next: songs => this.getAll$.set(State.Builder<Array<ReadSong>>().forSuccess(songs)),
        error: err => this.getAll$.set(State.Builder<Array<ReadSong>>().forError(err))
      });
  }



  constructor() { }
}
