import {Component, effect, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {Playlist} from "../../../service/model/playlist.model";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FavoriteSongBtnComponent} from "../../../shared/favorite-song-btn/favorite-song-btn.component";
import {SmallSongCardComponent} from "../../../shared/small-song-card/small-song-card.component";
import {SongCardComponent} from "../../home/song-card/song-card.component";
import {NgClass} from "@angular/common";
import {ToastService} from "../../../service/toast.service";
import {SongContentService} from "../../../service/song-content.service";
import {PlaylistService} from "../../../service/playlist.service";
import {ReadSong} from "../../../service/model/song.model";
import {FavouriteService} from "../../../service/favourite.service";
import {favouriteRequest} from "../../../service/model/favourite.model";

@Component({
  selector: 'app-list-playlist-song',
  standalone: true,
  imports: [
    FaIconComponent,
    FavoriteSongBtnComponent,
    SmallSongCardComponent,
    SongCardComponent,
    NgClass
  ],
  templateUrl: './list-playlist-song.component.html',
  styleUrl: './list-playlist-song.component.scss'
})
export class ListPlaylistSongComponent implements OnInit ,OnDestroy {

  @Input("playlist") playlist : Playlist | undefined;

  toastService = inject(ToastService);
  songContentService = inject(SongContentService);
  playlistService = inject(PlaylistService);
  favouriteService = inject(FavouriteService);

  loading = true;
  loadingCreation = false;

  songs: ReadSong[] = []; // Store the list of songs

  isGridView: boolean = false; // Default to list view
  // Toggle between grid and list view
  toggleView(): void {
    this.isGridView = !this.isGridView;
  }

  constructor() {
    this.listenToFetchSongsInPlaylist();
  }



  ngOnInit(): void {
    if (this.playlist?.id) {
      this.fetchSongsInPlaylist(this.playlist.id);
    }
  }

  fetchSongsInPlaylist(playlistId: number): void {
    this.playlistService.getSongsInPlaylist(playlistId)
  }

  private listenToFetchSongsInPlaylist() {
    effect(() => {
      const SongsInPlaylistState = this.playlistService.getSongsSig();
      if (SongsInPlaylistState.status === "OK") {
        this.loading = false;
        this.songs = SongsInPlaylistState.value || [];
      } else if (SongsInPlaylistState.status === "ERROR") {
        this.loading = false;
        this.toastService.show("Error when fetching the songs in this Playlist", "DANGER");
      }
    });
  }

  addToWishList(song: ReadSong) {
    this.loadingCreation = true;
    const favRequest: favouriteRequest = {
      songId: song.id,
    };
    this.favouriteService.addToFavourites(favRequest);
  }

  removedFromWishList(song: ReadSong) {
    this.favouriteService.removeFromFavourites(song.id);
  }

  onPlaySong(songToPlayFirst: ReadSong): void {
    this.songContentService.createNewQueue(songToPlayFirst, this.songs!);
  }





  ngOnDestroy(): void {
    this.playlistService.resetGetSongsState();
  }





}
