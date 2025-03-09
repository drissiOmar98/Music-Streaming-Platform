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
import {CreatedArtist} from "../../../service/model/artist.model";
import {ToastService} from "../../../service/toast.service";

@Component({
  selector: 'app-main-library',
  standalone: true,
  imports: [
    SmallSongCardComponent,
    FaIconComponent,
    NgClass,
    SongCardComponent,
    FavoriteSongBtnComponent
  ],
  templateUrl: './main-library.component.html',
  styleUrl: './main-library.component.scss'
})
export class MainLibraryComponent implements OnInit, OnDestroy {


  songService = inject(SongService);
  songContentService = inject(SongContentService);
  favouriteService= inject(FavouriteService);
  toastService = inject(ToastService);

  isLoading = false;
  loadingCreation = false;

  songs: Array<ReadSong> = [];

  constructor() {
    this.listenFetchAll();
    this.listenFavouriteItemAddition();
    this.listenFavouriteItemRemoval();
  }

  ngOnInit(): void {
    this.fetchSongs();
  }

  ngOnDestroy(): void {
    this.songService.resetGetAllState();
    this.favouriteService.resetAddToFavouritesState();
    this.favouriteService.resetRemoveFromFavouritesState();
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


  isGridView: boolean = false; // Default to list view
  // Toggle between grid and list view
  toggleView(): void {
    this.isGridView = !this.isGridView;
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
