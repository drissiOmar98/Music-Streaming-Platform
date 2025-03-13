import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {Event, Router, RouterModule} from "@angular/router";
import {SmallSongCardComponent} from "../../shared/small-song-card/small-song-card.component";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FavouriteService} from "../../service/favourite.service";
import {ToastService} from "../../service/toast.service";
import {FollowService} from "../../service/follow.service";
import {Favourite} from "../../service/model/favourite.model";
import {Follow} from "../../service/model/follow.model";
import {FavoriteSongBtnComponent} from "../../shared/favorite-song-btn/favorite-song-btn.component";
import {SmallArtistCardComponent} from "../../shared/small-artist-card/small-artist-card.component";


@Component({
  selector: 'app-library',
  standalone: true,
  imports: [
    FontAwesomeModule, RouterModule, SmallSongCardComponent, NgForOf, NgIf, NgClass, FavoriteSongBtnComponent, SmallArtistCardComponent,
  ],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss'
})
export class LibraryComponent implements OnInit ,OnDestroy {

  followService = inject(FollowService);
  toastService = inject(ToastService);

  wishListCount: number = 0;
  followedList: Follow[] | undefined = [];
  loading = true;

  constructor(

    private router: Router,
    private favouriteService: FavouriteService,

  ) {
    this.subscribeToWishlistCount();
    this.listenToFetchMyFollowedArtistList();
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.loadFollowedList();
  }

  subscribeToWishlistCount(): void {
    // Using computed signals to track any updates to the wishlist count
    effect(() => {
      this.wishListCount = this.favouriteService.wishListCountSig();
    });
  }

  loadFollowedList(): void {
    this.followService.getFollowedArtists();
  }


  private listenToFetchMyFollowedArtistList(): void {
    effect(() => {
      const myFollowedArtistState = this.followService.getFollowedArtistsSig();
      if (myFollowedArtistState.status === 'OK') {
        this.loading = false;
        this.followedList = myFollowedArtistState.value || [];
      } else if (myFollowedArtistState.status === 'ERROR') {
        this.loading = false;
        this.toastService.show('Error when fetching Your Wish List', "DANGER");
      }
    });
  }





  isCorrect = false;
  countLikedTrack = 0;
  activeFilter: string = 'playlists'; // Default active filter

  setActiveFilter(filter: string) {
    this.activeFilter = filter;
    // Add logic to filter content based on the selected filter
  }


  onInputChange($event: Event) {

  }
}
