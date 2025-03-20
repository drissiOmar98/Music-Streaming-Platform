import {Component, DestroyRef, effect, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Playlist, RemoveSongFromPlaylistRequest} from "../../../service/model/playlist.model";
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
import Swal from 'sweetalert2';
import {State} from "../../../shared/model/state.model";

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
export class ListPlaylistSongComponent implements  OnChanges ,OnDestroy {

  @Input("playlist") playlist : Playlist | undefined;

  toastService = inject(ToastService);
  songContentService = inject(SongContentService);
  playlistService = inject(PlaylistService);
  favouriteService = inject(FavouriteService);
  destroyRef = inject(DestroyRef); // Inject DestroyRef for effect cleanup


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
    this.listenPlaylistItemRemoval();
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['playlist'] && this.playlist?.id) {
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

  onDeleteSong(song: ReadSong): void {
    Swal.fire({
      title: 'Remove song?',
      text: `Are you sure you want to remove "${song.title}" from this playlist?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel',
      customClass: {
        container: 'spotify-swal-container',
        popup: 'spotify-swal-popup',
        title: 'spotify-swal-title',
        htmlContainer: 'spotify-swal-content',
        confirmButton: 'spotify-swal-confirm-btn',
        cancelButton: 'spotify-swal-cancel-btn',
      },
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const request: RemoveSongFromPlaylistRequest = {
            playlistId: this.playlist!.id,
            songId: song.id,
          };

          await this.playlistService.removeSongFromPlaylist(request);

          // Show success message
          return Swal.fire({
            title: 'Removed!',
            text: `"${song.title}" has been removed from your playlist.`,
            icon: 'success',
            confirmButtonText: 'OK',
            customClass: {
              popup: 'spotify-swal-popup',
              title: 'spotify-swal-title',
              confirmButton: 'spotify-swal-confirm-btn',
            },
            showClass: {
              popup: 'animate__animated animate__zoomIn', // Enhanced animation
            },
            hideClass: {
              popup: 'animate__animated animate__zoomOut',
            },
            timer: 2000, // Auto close after 2 sec
          });
        } catch (error) {
          Swal.fire({
            title: 'Error!',
            text: 'Something went wrong. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: {
              popup: 'spotify-swal-popup',
              title: 'spotify-swal-title',
              confirmButton: 'spotify-swal-confirm-btn',
            }
          });
          throw error; // Ensure the error is propagated
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Refresh the songs list after successful deletion
        if (this.playlist?.id) {
          this.fetchSongsInPlaylist(this.playlist.id);
        }
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





  onPlaylistItemRemovalOk(removeItemFromFavouriteState: State<void>): void {
    this.loadingCreation = false; // Set loading state to false
    this.toastService.show("Removed successfully from your Playlist.", "SUCCESS");

    // Refresh the songs list after successful deletion
    if (this.playlist?.id) {
      this.fetchSongsInPlaylist(this.playlist.id);
    }
  }

  private onPlaylistItemRemovalError(): void {
    this.loadingCreation = false; // Set loading state to false
    this.toastService.show("Couldn't remove the song from your Playlist, please try again.", "DANGER")
  }





  ngOnDestroy(): void {
    this.playlistService.resetGetSongsState();
    this.playlistService.resetRemoveSongState();
  }





}
