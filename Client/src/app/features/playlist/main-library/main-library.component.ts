import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {SmallSongCardComponent} from "../../../shared/small-song-card/small-song-card.component";
import {SongService} from "../../../service/song.service";
import {SongContentService} from "../../../service/song-content.service";
import {ReadSong} from "../../../service/model/song.model";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgClass} from "@angular/common";
import {SongCardComponent} from "../../home/song-card/song-card.component";
import {FavoriteSongBtnComponent} from "../../../shared/favorite-song-btn/favorite-song-btn.component";
import {favouriteRequest} from "../../../service/model/favourite.model";
import {FavouriteService} from "../../../service/favourite.service";
import {State} from "../../../shared/model/state.model";
import {ToastService} from "../../../service/toast.service";
import {PlaylistBtnComponent} from "../../../shared/playlist-btn/playlist-btn.component";
import {Router} from "@angular/router";
import {PlaylistService} from "../../../service/playlist.service";
import {AddSongToPlaylistRequest, Playlist, RemoveSongFromPlaylistRequest} from "../../../service/model/playlist.model";

@Component({
  selector: 'app-main-library',
  standalone: true,
  imports: [
    SmallSongCardComponent,
    FaIconComponent,
    NgClass,
    SongCardComponent,
    FavoriteSongBtnComponent,
    PlaylistBtnComponent
  ],
  templateUrl: './main-library.component.html',
  styleUrl: './main-library.component.scss'
})
export class MainLibraryComponent implements OnInit, OnDestroy {

  router = inject(Router);
  songService = inject(SongService);
  songContentService = inject(SongContentService);
  favouriteService= inject(FavouriteService);
  toastService = inject(ToastService);
  playlistService = inject(PlaylistService)


  isLoading = false;
  loadingCreation = false;
  loading = true;

  songs: Array<ReadSong> = [];
  playlists: Array<Playlist> = [];

  constructor() {
    this.listenFetchAll();
    this.listenToFetchMyPlaylists();
    this.listenFavouriteItemAddition();
    this.listenFavouriteItemRemoval();
    this.listenPlaylistItemAddition();
    this.listenPlaylistItemRemoval();
  }

  ngOnInit(): void {
    this.fetchSongs();
    this.loadUserPlaylist();
  }

  ngOnDestroy(): void {
    this.songService.resetGetAllState();
    this.favouriteService.resetAddToFavouritesState();
    this.favouriteService.resetRemoveFromFavouritesState();
    this.playlistService.resetAddSongState();
    this.playlistService.resetRemoveSongState();
  }




  loadUserPlaylist(): void {
    this.playlistService.getAllPlaylists();
  }

  private fetchSongs() {
    this.isLoading = true;
    this.songService.getSongs();
  }

  onPlaySong(songToPlayFirst: ReadSong): void {
    this.songContentService.createNewQueue(songToPlayFirst, this.songs!);
  }

  private listenFetchAll(){
    effect(() => {
      if(this.songService.getAllSig().status === "OK") {
        this.songs = this.songService.getAllSig().value!;
      }
      this.isLoading = false;
    });
  }

  private listenToFetchMyPlaylists(): void {
    effect(() => {
      const myPlaylistState = this.playlistService.getAllSig();
      if (myPlaylistState.status === 'OK') {
        this.loading = false;
        this.playlists = myPlaylistState.value || [];
      } else if (myPlaylistState.status === 'ERROR') {
        this.loading = false;
        this.toastService.show('Error when fetching Your PlayList', "DANGER");
      }
    });
  }



  isGridView: boolean = false; // Default to list view
  // Toggle between grid and list view
  toggleView(): void {
    this.isGridView = !this.isGridView;
  }

  handleAddedToPlaylist(event: { song: ReadSong, playlist: Playlist }) {
    const request: AddSongToPlaylistRequest = {
      playlistId: event.playlist.id,
      songId: event.song.id,
    };
    this.playlistService.addSongToPlaylist(request);
  }

  handleRemovedFromPlaylist(event: { song: ReadSong, playlist: Playlist }) {
    const request: RemoveSongFromPlaylistRequest = {
      playlistId: event.playlist.id,
      songId: event.song.id,
    };
    this.playlistService.removeSongFromPlaylist(request);
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



  listenFavouriteItemAddition() {
    effect(() => {
      let addItemToFavouriteState = this.favouriteService.addToFavouritesSig();
      if (addItemToFavouriteState.status === "OK") {
        this.onWishlistAdditionOk(addItemToFavouriteState);
      } else if (addItemToFavouriteState.status === "ERROR") {
        this.onWishlistAdditionError();
      }
    });
  }

  private listenFavouriteItemRemoval(): void {
    effect(() => {
      let removeItemFromFavouriteState = this.favouriteService.removeFromFavouritesSig(); // Track state for item removal
      if (removeItemFromFavouriteState.status === 'OK') {
        this.onFavouriteItemRemovalOk(removeItemFromFavouriteState);
      } else if (removeItemFromFavouriteState.status === 'ERROR') {
        this.onFavouriteItemRemovalError();
      }
    });
  }

  listenPlaylistItemAddition() {
    effect(() => {
      let addItemToPlaylistState = this.playlistService.addSongSig();
      if (addItemToPlaylistState.status === "OK") {
        this.onPlaylistAdditionOk(addItemToPlaylistState);
      } else if ((addItemToPlaylistState.status === "ERROR")) {
        this.onPlaylistAdditionError();
      }
    });
  }

  private listenPlaylistItemRemoval(): void {
    effect(() => {
      let removeItemFromPlaylistState = this.playlistService.removeSongSig(); // Track state for item removal
      if (removeItemFromPlaylistState.status === 'OK') {
        this.onPlaylistItemRemovalOk(removeItemFromPlaylistState);
      } else if (removeItemFromPlaylistState.status === 'ERROR') {
        this.onPlaylistItemRemovalError();
      }
    });
  }

  onWishlistAdditionOk(state: State<void>) {
    this.loadingCreation = false;
    this.toastService.show("Song added successfully to your wishlist.", "SUCCESS");
  }

  onPlaylistAdditionOk(state: State<void>) {
    this.loadingCreation = false;
    this.toastService.show("Song added successfully to your playlist.", "SUCCESS");
  }

  onPlaylistAdditionError() {
    this.loadingCreation = false;
    this.toastService.show("Failed to add Song to playlist.", "DANGER");
  }

  onWishlistAdditionError() {
    this.loadingCreation = false;
    this.toastService.show("Failed to add Song to wishlist.", "DANGER");
  }

  onFavouriteItemRemovalOk(removeItemFromFavouriteState: State<void>): void {
    this.loadingCreation = false; // Set loading state to false
    this.toastService.show("removed successfully from your WishList.", "SUCCESS");
  }

  private onFavouriteItemRemovalError(): void {
    this.loadingCreation = false; // Set loading state to false
    this.toastService.show("Couldn't remove the song from your WishList, please try again.", "DANGER")
  }

  onPlaylistItemRemovalOk(removeItemFromFavouriteState: State<void>): void {
    this.loadingCreation = false; // Set loading state to false
    this.toastService.show("removed successfully from your Playlist.", "SUCCESS");
  }

  private onPlaylistItemRemovalError(): void {
    this.loadingCreation = false; // Set loading state to false
    this.toastService.show("Couldn't remove the song from your Playlist, please try again.", "DANGER")
  }



  handleAddToPlaylist(event: { song: any, playlist: any }) {
    event.playlist.songs.push(event.song);
    console.log(`Added ${event.song.name} to ${event.playlist.name}`);
  }

  handleCreatePlaylist(name: string) {

  }


  handleGoToAlbum(song: ReadSong) {
    this.router.navigate(['/music-item', song.id]);
  }

  handleShareSong(song: any) {
    console.log(`Sharing ${song.name}`);
  }





}
