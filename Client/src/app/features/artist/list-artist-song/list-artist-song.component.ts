import {Component, effect, EventEmitter, inject, Input, Output} from '@angular/core';
import {Artist} from "../../../service/model/artist.model";
import {ReadSong} from "../../../service/model/song.model";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {FollowArtistBtnComponent} from "../../../shared/follow-artist-btn/follow-artist-btn.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FavoriteSongBtnComponent} from "../../../shared/favorite-song-btn/favorite-song-btn.component";
import {SmallSongCardComponent} from "../../../shared/small-song-card/small-song-card.component";
import {SongCardComponent} from "../../home/song-card/song-card.component";
import {favouriteRequest} from "../../../service/model/favourite.model";
import {State} from "../../../shared/model/state.model";
import {FavouriteService} from "../../../service/favourite.service";
import {ToastService} from "../../../service/toast.service";
import {SongContentService} from "../../../service/song-content.service";


@Component({
  selector: 'app-list-artist-song',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    FollowArtistBtnComponent,
    FaIconComponent,
    FavoriteSongBtnComponent,
    SmallSongCardComponent,
    SongCardComponent,
    NgClass
  ],
  templateUrl: './list-artist-song.component.html',
  styleUrl: './list-artist-song.component.scss'
})
export class ListArtistSongComponent {
  songContentService = inject(SongContentService);
  favouriteService= inject(FavouriteService);
  toastService = inject(ToastService);
  router = inject(Router);
  @Input() tracks: Array<ReadSong> =[];
  @Input() artist: Artist | undefined;
  @Output() songToPlay$ = new EventEmitter<ReadSong>();

  loadingCreation = false;



  constructor() {
    this.listenFavouriteItemAddition();
    this.listenFavouriteItemRemoval();
  }


  isLoading = false;
  isGridView: boolean = false; // Default to list view
  // Toggle between grid and list view
  toggleView(): void {
    this.isGridView = !this.isGridView;
  }



  // Handle play button click for a track
  playTrack(track: ReadSong) {
    if (track) {
      this.songToPlay$.emit(track);
      //this.playbackService.setPlayingState(this.artist?.id, true);
    }
  }

  onPlaySong(songToPlayFirst: ReadSong): void {
    this.songContentService.createNewQueue(songToPlayFirst, this.tracks!);
  }


  // Navigate to the music item component
  navigateToMusicItem(track: ReadSong) {
    this.router.navigate(['/music-item', track.id]); // Use track.id as the route parameter
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

  onWishlistAdditionOk(state: State<void>) {
    this.loadingCreation = false;
    this.toastService.show("Song added successfully to your wishlist.", "SUCCESS");
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



}
