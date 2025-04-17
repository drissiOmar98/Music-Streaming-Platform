import {Component, effect, EventEmitter, inject, input, OnInit, Output} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {ReadSong} from "../../service/model/song.model";
import {FavouriteService} from "../../service/favourite.service";
import {ToastService} from "../../service/toast.service";
import {State} from "../model/state.model";
import {IconProp} from "@fortawesome/fontawesome-svg-core";


@Component({
  selector: 'app-favorite-song-btn',
  standalone: true,
  imports: [
    FaIconComponent
  ],
  templateUrl: './favorite-song-btn.component.html',
  styleUrl: './favorite-song-btn.component.scss'
})
export class FavoriteSongBtnComponent implements OnInit {

  @Output() addedToWishList = new EventEmitter<ReadSong>();
  @Output() removedFromWishList = new EventEmitter<ReadSong>();

  favouriteService = inject(FavouriteService);
  toastService = inject(ToastService);

  song = input.required<ReadSong>();
  inWishlist: Map<number, boolean> = new Map();

  constructor() {
    this.listenCheckIfSongInWishList();
  }

  ngOnInit(): void {
    const song = this.song();
    const songId = song.id || song.songId; // Use `id` if available, otherwise fall back to `songId`

    if (songId) {
      //console.log("Song ID in FavoriteSongBtnComponent:", songId); // Debugging
      this.checkSongInWishlist(songId);
    } else {
      console.error("Song ID is undefined.");
    }
  }

  private listenCheckIfSongInWishList(): void {
    effect(() => {
      const song = this.song();
      const songId = song.id || song.songId; // Use `id` if available, otherwise fall back to `songId`

      if (!songId) {
        //console.error("Song ID is undefined.");
        return;
      }

      const itemStateSignal = this.favouriteService.getIsSongInWishListSignal(songId);
      const state = itemStateSignal();
      if (state.status === "OK") {
        this.inWishlist.set(songId, state.value ?? false);
        //console.log("Song in wishList:", songId, state.value);
      } else if (state.status === "ERROR") {
        this.toastService.show("Failed to check song status", "DANGER");
        //console.error("Error fetching song in wishlist state");
      }
    });
  }

  private checkSongInWishlist(songId: number): void {
    //console.log("Checking if song is in Favourite List:", songId);
    this.favouriteService.checkSongInWishList(songId);
  }

  addRemoveItemWishlist(song: ReadSong): void {
    const songId = song.id || song.songId; // Use `id` if available, otherwise fall back to `songId`

    if (!songId) {
      //console.error("Song ID is undefined.");
      return;
    }

    //console.log("inWishList before action:", this.inWishlist.get(songId));
    if (this.inWishlist.get(songId)) {
      this.removedFromWishList.emit(song); // Emit event for removal
      this.favouriteService.getIsSongInWishListSignal(songId).set(State.Builder<boolean>().forSuccess(false));
    } else {
      this.addedToWishList.emit(song); // Emit event for addition
      this.favouriteService.getIsSongInWishListSignal(songId).set(State.Builder<boolean>().forSuccess(true));
    }
    //console.log("inWishList after action:", this.inWishlist.get(songId));
  }

  getButtonLikeClass(songId: number): IconProp {
    const isInWishList: boolean | undefined = this.inWishlist.get(songId);
    return isInWishList ? ['fas', 'heart'] as IconProp : ['far', 'heart'] as IconProp;
  }


}
