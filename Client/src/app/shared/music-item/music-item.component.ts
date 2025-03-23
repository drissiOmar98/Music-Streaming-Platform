import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {ReadSong} from "../../service/model/song.model";
import {ActivatedRoute} from "@angular/router";
import {SongService} from "../../service/song.service";
import {map} from "rxjs";
import {ToastService} from "../../service/toast.service";
import {FavoriteSongBtnComponent} from "../favorite-song-btn/favorite-song-btn.component";
import {favouriteRequest} from "../../service/model/favourite.model";
import {State} from "../model/state.model";
import {FavouriteService} from "../../service/favourite.service";

@Component({
  selector: 'app-music-item',
  standalone: true,
  imports: [
    FavoriteSongBtnComponent
  ],
  templateUrl: './music-item.component.html',
  styleUrl: './music-item.component.scss'
})
export class MusicItemComponent implements OnInit, OnDestroy {
  track: ReadSong | undefined;
  activatedRoute = inject(ActivatedRoute);
  songService=inject(SongService);
  toastService = inject(ToastService);
  favouriteService = inject(FavouriteService);


  songDetails: ReadSong | undefined;

  loading = true;
  currentSongId!: number;
  showPlayButton: any;
  showPauseButton: any;

  loadingCreation = false;

  ngOnInit(): void {
    this.extractIdParamFromRouter();
  }

  ngOnDestroy(): void {
    this.favouriteService.resetAddToFavouritesState();
    this.favouriteService.resetRemoveFromFavouritesState();
  }

  constructor() {
    this.listenToFetchSongInfo();
    this.listenFavouriteItemAddition();
    this.listenFavouriteItemRemoval();
  }

  private extractIdParamFromRouter() {
    this.activatedRoute.paramMap.pipe(
      map(params => params.get('id')),
      map(id => id ? +id : null)
    ).subscribe({
      next: id => {
        if (id !== null) {
          this.fetchSongInfoById(id);
        } else {
          console.error('Invalid song ID');
        }
      },
      error: err => {
        console.error('Error extracting song ID:', err);
      }
    });
  }



  private fetchSongInfoById(songId: number) {
    const songInfo = { id: songId } as ReadSong;
    this.songService.fetchSongInfoById(songInfo);
  }

  private listenToFetchSongInfo() {
    effect(() => {
      const songInfoState = this.songService.songInfoByIdSig();
      if (songInfoState.status === "OK") {
        this.loading = false;
        this.track =  songInfoState.value;
      } else if (songInfoState.status === "ERROR") {
        this.loading = false;
        this.toastService.show("Error when fetching the song", "DANGER");
      }
    });
  }

  onAddedToWishList(song: ReadSong) {
    this.loadingCreation = true;
    const favRequest: favouriteRequest = {
      songId: song.id,
    };
    this.favouriteService.addToFavourites(favRequest);
  }

  onRemovedFromWishList(song: ReadSong) {
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
