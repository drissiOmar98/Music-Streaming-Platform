import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {State} from "../shared/model/state.model";

import {
  AddSongToPlaylistRequest,
  CreatedPlaylist,
  NewPlaylist,
  Playlist,
  RemoveSongFromPlaylistRequest
} from "./model/playlist.model";
import {CreatedArtist} from "./model/artist.model";
import {environment} from "../../environments/environment";
import {ReadSong} from "./model/song.model";


@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  http = inject(HttpClient);

  // Signals for createPlaylist
  private add$: WritableSignal<State<CreatedPlaylist>> = signal(State.Builder<CreatedPlaylist>().forInit());
  addSig = computed(() => this.add$());

  // Signals for getAllPlaylists
  private getAll$: WritableSignal<State<Array<Playlist>>> = signal(State.Builder<Array<Playlist>>().forInit());
  getAllSig = computed(() => this.getAll$());

  // Signals for getPlaylistById
  private getById$: WritableSignal<State<Playlist>> = signal(State.Builder<Playlist>().forInit());
  getByIdSig = computed(() => this.getById$());

  // Signals for deletePlaylist
  private delete$: WritableSignal<State<void>> = signal(State.Builder<void>().forInit());
  deleteSig = computed(() => this.delete$());

  // Signals for updatePlaylist
  private update$: WritableSignal<State<number>> = signal(State.Builder<number>().forInit());
  updateSig = computed(() => this.update$());

  // Signals for getSongsInPlaylist
  private getSongs$: WritableSignal<State<ReadSong[]>> = signal(State.Builder<ReadSong[]>().forInit());
  getSongsSig = computed(() => this.getSongs$());

  // Signals for addSongToPlaylist
  private addSong$: WritableSignal<State<void>> = signal(State.Builder<void>().forInit());
  addSongSig = computed(() => this.addSong$());

  // Signals for removeSongFromPlaylist
  private removeSong$: WritableSignal<State<void>> = signal(State.Builder<void>().forInit());
  removeSongSig = computed(() => this.removeSong$());

  // Signals for clearPlaylist
  private clear$: WritableSignal<State<void>> = signal(State.Builder<void>().forInit());
  clearSig = computed(() => this.clear$());

  // Signals for isSongInPlaylist
  private containsSong$: WritableSignal<State<boolean>> = signal(State.Builder<boolean>().forInit());
  containsSongSig = computed(() => this.containsSong$());

  // Signals for reorderSongsInPlaylist
  private reorder$: WritableSignal<State<void>> = signal(State.Builder<void>().forInit());
  reorderSig = computed(() => this.reorder$());


  createPlaylist(newPlaylist: NewPlaylist): void {
    const formData = new FormData();
    formData.append('cover', newPlaylist.cover?.file!);
    const clone = structuredClone(newPlaylist);
    clone.cover = undefined;
    formData.append("dto", JSON.stringify(clone));
    this.http.post<CreatedPlaylist>(`${environment.API_URL}/playlists/add`, formData)
      .subscribe({
      next: playlist => this.add$.set(State.Builder<CreatedPlaylist>().forSuccess(playlist)),
      error: err => this.add$.set(State.Builder<CreatedPlaylist>().forError(err)),
    });
  }

  // Get all playlists for the authenticated user
  getAllPlaylists(): void {
    this.http.get<Array<Playlist>>(`${environment.API_URL}/playlists`).subscribe({
      next: (playlists) => this.getAll$.set(State.Builder<Array<Playlist>>().forSuccess(playlists)),
      error: (err) => this.getAll$.set(State.Builder<Array<Playlist>>().forError(err)),
    });
  }

  // Get a playlist by ID
  getPlaylistById(id: number): void {
    this.http.get<Playlist>(`${environment.API_URL}/playlists/${id}`).subscribe({
      next: (playlist) => this.getById$.set(State.Builder<Playlist>().forSuccess(playlist)),
      error: (err) => this.getById$.set(State.Builder<Playlist>().forError(err)),
    });
  }

  // Delete a playlist
  deletePlaylist(id: number): void {
    this.http.delete<void>(`${environment.API_URL}/playlists/${id}`).subscribe({
      next: () => this.delete$.set(State.Builder<void>().forSuccess()),
      error: (err) => this.delete$.set(State.Builder<void>().forError(err)),
    });
  }

  // Get songs in a playlist
  getSongsInPlaylist(playlistId: number): void {
    this.http.get<Array<ReadSong>>(`${environment.API_URL}/playlists/${playlistId}/songs`).subscribe({
      next: (songs) => this.getSongs$.set(State.Builder<Array<ReadSong>>().forSuccess(songs)),
      error: (err) => this.getSongs$.set(State.Builder<Array<ReadSong>>().forError(err)),
    });
  }

  // Add a song to a playlist
  addSongToPlaylist(request: AddSongToPlaylistRequest): void {
    this.http.post<void>(`${environment.API_URL}/playlists/add-song`, request).subscribe({
      next: () => this.addSong$.set(State.Builder<void>().forSuccess()),
      error: (err) => this.addSong$.set(State.Builder<void>().forError(err)),
    });
  }

  // Remove a song from a playlist
  removeSongFromPlaylist(request: RemoveSongFromPlaylistRequest): void {
    this.http.post<void>(`${environment.API_URL}/playlists/remove-song`, request).subscribe({
      next: () => this.removeSong$.set(State.Builder<void>().forSuccess()),
      error: (err) => this.removeSong$.set(State.Builder<void>().forError(err)),
    });
  }

  // Clear all songs from a playlist
  clearPlaylist(playlistId: number): void {
    this.http.delete<void>(`${environment.API_URL}/playlists/${playlistId}/clear`).subscribe({
      next: () => this.clear$.set(State.Builder<void>().forSuccess()),
      error: (err) => this.clear$.set(State.Builder<void>().forError(err)),
    });
  }

  // Check if a song is in a playlist
  isSongInPlaylist(playlistId: number, songId: number): void {
    this.http.get<boolean>(`${environment.API_URL}/playlists/${playlistId}/contains-song/${songId}`).subscribe({
      next: (contains) => this.containsSong$.set(State.Builder<boolean>().forSuccess(contains)),
      error: (err) => this.containsSong$.set(State.Builder<boolean>().forError(err)),
    });
  }

  // Reorder songs in a playlist
  reorderSongsInPlaylist(playlistId: number, newOrder: number[]): void {
    this.http.put<void>(`${environment.API_URL}/playlists/${playlistId}/reorder`, newOrder).subscribe({
      next: () => this.reorder$.set(State.Builder<void>().forSuccess()),
      error: (err) => this.reorder$.set(State.Builder<void>().forError(err)),
    });
  }

  // Update an existing playlist
  updatePlaylist(id: number, updatedPlaylist: NewPlaylist): void {
    const formData = new FormData();
    formData.append('cover',updatedPlaylist.cover?.file!);
    const clone = structuredClone(updatedPlaylist);
    clone.cover = undefined; // Remove the cover object before serializing
    formData.append('dto', JSON.stringify(clone));
    this.http.put<number>(`${environment.API_URL}/playlists/${id}/update`, formData).subscribe({
      next: (updatedPlaylistId) => this.update$.set(State.Builder<number>().forSuccess(updatedPlaylistId)),
      error: (err) => this.update$.set(State.Builder<number>().forError(err)),
    });
  }


  // Reset methods for each signal
  resetAddState(): void {
    this.add$.set(State.Builder<CreatedPlaylist>().forInit());
  }

  resetGetAllState(): void {
    this.getAll$.set(State.Builder<Playlist[]>().forInit());
  }

  resetGetByIdState(): void {
    this.getById$.set(State.Builder<Playlist>().forInit());
  }

  resetGetSongsState(): void {
    this.getSongs$.set(State.Builder<ReadSong[]>().forInit());
  }

  resetAddSongState(): void {
    this.addSong$.set(State.Builder<void>().forInit());
  }

  resetRemoveSongState(): void {
    this.removeSong$.set(State.Builder<void>().forInit());
  }

  resetClearState(): void {
    this.clear$.set(State.Builder<void>().forInit());
  }

  resetContainsSongState(): void {
    this.containsSong$.set(State.Builder<boolean>().forInit());
  }

  resetReorderState(): void {
    this.reorder$.set(State.Builder<void>().forInit());
  }

  resetUpdateState(): void {
    this.update$.set(State.Builder<number>().forInit());
  }

  resetDeleteState(): void {
    this.delete$.set(State.Builder<void>().forInit());
  }












  constructor() { }
}
