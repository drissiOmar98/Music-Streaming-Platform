import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {State} from "../shared/model/state.model";
import {CreatedSong, NewSong, ReadSong} from "./model/song.model";
import {CreatedArtist} from "./model/artist.model";
import {environment} from "../../environments/environment";
import {Oauth2AuthService} from "../auth/oauth2-auth.service";



@Injectable({
  providedIn: 'root'
})
export class SongService {

  http = inject(HttpClient);
  authService = inject(Oauth2AuthService);

  private add$: WritableSignal<State<CreatedSong>> = signal(State.Builder<CreatedSong>().forInit());
  addSig = computed(() => this.add$());

  private getAll$: WritableSignal<State<Array<ReadSong>>> = signal(State.Builder<Array<ReadSong>>().forInit());
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

  getSongs(): void {
    this.http.get<Array<ReadSong>>(`${environment.API_URL}/songs/all`).subscribe({
      next: songs => {
        console.log('Songs fetched successfully:', songs);
        this.getAll$.set(State.Builder<Array<ReadSong>>().forSuccess(songs));
      },
      error: err => {
        console.error('Error fetching songs:', err);
        this.getAll$.set(State.Builder<Array<ReadSong>>().forError(err));
      },
    });
  }

  // getSongs(): void {
  //   this.authService.authReady$.subscribe(() => {
  //     console.log('Fetching all songs after authentication...');
  //     console.log('Current access token:', this.authService.accessToken);
  //     this.http.get<Array<ReadSong>>(`${environment.API_URL}/songs/all`).subscribe({
  //       next: songs => {
  //         console.log('Songs fetched successfully:', songs);
  //         this.getAll$.set(State.Builder<Array<ReadSong>>().forSuccess(songs));
  //       },
  //       error: err => {
  //         console.error('Error fetching songs:', err);
  //         this.getAll$.set(State.Builder<Array<ReadSong>>().forError(err));
  //       },
  //     });
  //   });
  // }
  // getSongs(): void {
  //   console.log('Fetching all songs...');
  //   this.authService.authStatus$.pipe(
  //
  //     switchMap(() => {
  //       console.log('Current access token:', this.authService.accessToken); // Log the token
  //       return this.http.get<Array<ReadSong>>(`${environment.API_URL}/songs/all`);
  //     })
  //   ).subscribe({
  //     next: songs => {
  //       console.log('Songs fetched successfully:', songs);
  //       this.getAll$.set(State.Builder<Array<ReadSong>>().forSuccess(songs));
  //     },
  //     error: err => {
  //       console.error('Error fetching songs:', err);
  //       this.getAll$.set(State.Builder<Array<ReadSong>>().forError(err));
  //     },
  //   });
  // }


  resetAddState(): void {
    this.add$.set(State.Builder<CreatedSong>().forInit());
  }

  resetGetAllState(): void {
    this.getAll$.set(State.Builder<Array<ReadSong>>().forInit());
  }




  constructor() {

  }
}
