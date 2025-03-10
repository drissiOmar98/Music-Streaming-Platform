import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {ToastService} from "../../../service/toast.service";
import {FavouriteService} from "../../../service/favourite.service";
import {Favourite} from "../../../service/model/favourite.model";
import {State} from "../../../shared/model/state.model";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {SongCardComponent} from "../../home/song-card/song-card.component";
import {FavoriteSongBtnComponent} from "../../../shared/favorite-song-btn/favorite-song-btn.component";
import {SmallSongCardComponent} from "../../../shared/small-song-card/small-song-card.component";
import {NgClass} from "@angular/common";
import {ReadSong} from "../../../service/model/song.model";
import {SongContentService} from "../../../service/song-content.service";

@Component({
  selector: 'app-list-liked-song',
  standalone: true,
  imports: [
    FaIconComponent,
    SongCardComponent,
    FavoriteSongBtnComponent,
    SmallSongCardComponent,
    NgClass
  ],
  templateUrl: './list-liked-song.component.html',
  styleUrl: './list-liked-song.component.scss'
})
export class ListLikedSongComponent implements OnInit ,OnDestroy  {

  favouriteService = inject(FavouriteService);
  toastService = inject(ToastService);
  songContentService = inject(SongContentService);

  favouriteItems: Favourite[] | undefined = [];
  loading = true;
  loadingCreation = false;

  isGridView: boolean = false; // Default to list view
  // Toggle between grid and list view
  toggleView(): void {
    this.isGridView = !this.isGridView;
  }


  constructor() {
    this.listenToFetchMyWishList();
    this.listenFavouriteItemRemoval();
  }


  ngOnInit(): void {
    this.loadWishList();
  }

  ngOnDestroy() {
    this.favouriteService.resetRemoveFromFavouritesState();
  }

  loadWishList(): void {
    this.favouriteService.getMyWishList();
  }

  removedFromWishList(song: ReadSong) {
    this.favouriteService.removeFromFavourites(song.id);
  }

  onPlaySong(songToPlayFirst: ReadSong): void {
    if (this.favouriteItems && this.favouriteItems.length > 0) {
      const songs = this.favouriteItems.map(favourite => favourite.songDetails); // Extract song details from favourites
      this.songContentService.createNewQueue(songToPlayFirst, songs);
    } else {
      console.error("No liked songs available to play.");
    }
  }


  private listenToFetchMyWishList(): void {
    effect(() => {
      const myWishListState = this.favouriteService.getWishListSig();
      if (myWishListState.status === 'OK') {
        this.loading = false;
        this.favouriteItems = myWishListState.value || [];
      } else if (myWishListState.status === 'ERROR') {
        this.loading = false;
        this.toastService.show('Error when fetching Your Wish List', "DANGER");
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

  onFavouriteItemRemovalOk(removeItemFromFavouriteState: State<void>): void {
    this.loadingCreation = false; // Set loading state to false
    this.toastService.show("removed successfully from your WishList.", "SUCCESS");
  }
  private onFavouriteItemRemovalError(): void {
    this.loadingCreation = false; // Set loading state to false
    this.toastService.show("Couldn't remove the song from your WishList, please try again.", "DANGER")
  }


}
