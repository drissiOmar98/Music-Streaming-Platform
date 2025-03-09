import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {Router, RouterModule} from "@angular/router";
import {SongService} from "../../service/song.service";
import {ReadSong} from "../../service/model/song.model";
import {SongContentService} from "../../service/song-content.service";
import {SmallSongCardComponent} from "../../shared/small-song-card/small-song-card.component";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FavouriteService} from "../../service/favourite.service";

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [
    FontAwesomeModule, RouterModule, SmallSongCardComponent, NgForOf, NgIf, NgClass,
  ],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss'
})
export class LibraryComponent {

  wishListCount: number = 0;

  constructor(

    private router: Router,
    private favouriteService: FavouriteService,

  ) {
    this.subscribeToWishlistCount();
  }

  subscribeToWishlistCount(): void {
    // Using computed signals to track any updates to the wishlist count
    effect(() => {
      this.wishListCount = this.favouriteService.wishListCountSig();
    });
  }




  onInputChange($event: Event) {

  }

  isCorrect = false;
  countLikedTrack = 0;
  activeFilter: string = 'playlists'; // Default active filter

  setActiveFilter(filter: string) {
    this.activeFilter = filter;
    // Add logic to filter content based on the selected filter
  }
}
