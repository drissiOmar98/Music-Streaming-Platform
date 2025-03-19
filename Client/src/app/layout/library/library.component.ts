import {Component, effect, HostListener, inject, OnDestroy, OnInit} from '@angular/core';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {Event, Router, RouterModule} from "@angular/router";
import {SmallSongCardComponent} from "../../shared/small-song-card/small-song-card.component";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FavouriteService} from "../../service/favourite.service";
import {ToastService} from "../../service/toast.service";
import {FollowService} from "../../service/follow.service";
import {Follow} from "../../service/model/follow.model";
import {FavoriteSongBtnComponent} from "../../shared/favorite-song-btn/favorite-song-btn.component";
import {SmallArtistCardComponent} from "../../shared/small-artist-card/small-artist-card.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NewPlaylistComponent} from "../../features/playlist/new-playlist/new-playlist.component";
import {PlaylistService} from "../../service/playlist.service";
import {Playlist} from "../../service/model/playlist.model";
import {SmallPlaylistCardComponent} from "../../shared/small-playlist-card/small-playlist-card.component";


@Component({
  selector: 'app-library',
  standalone: true,
  imports: [
    FontAwesomeModule, RouterModule, SmallSongCardComponent, NgForOf, NgIf, NgClass, FavoriteSongBtnComponent, SmallArtistCardComponent, SmallPlaylistCardComponent,
  ],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss'
})
export class LibraryComponent implements OnInit ,OnDestroy {

  followService = inject(FollowService);
  toastService = inject(ToastService);
  playlistService = inject(PlaylistService)
  private modalService = inject(NgbModal);


  wishListCount: number = 0;
  followedList: Follow[] | undefined = [];
  playlists: Playlist[] | undefined = [];
  loading = true;

  isDropdownOpen = false;

  // Toggle dropdown
  toggleDropdown(event: MouseEvent) {
    event.stopPropagation(); // Prevent event bubbling
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.isDropdownOpen = false;
    }
  }
  constructor(private router: Router, private favouriteService: FavouriteService) {
    this.subscribeToWishlistCount();
    this.listenToFetchMyFollowedArtistList();
    this.listenToFetchMyPlaylists();
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.loadFollowedList();
    this.loadUserPlaylist();
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

  loadUserPlaylist(): void {
    this.playlistService.getAllPlaylists();
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





  isCorrect = false;
  countLikedTrack = 0;
  activeFilter: string = 'playlists'; // Default active filter

  setActiveFilter(filter: string) {
    this.activeFilter = filter;
    // Add logic to filter content based on the selected filter
  }


  onInputChange($event: Event) {
  }

  openNewPlaylistDialog() {
    const modalRef = this.modalService.open(NewPlaylistComponent, {
      centered: true,
      size: 'md', // Medium size for Spotify-like feel
    });

    modalRef.result.then((result) => {
      if (result) {
        console.log('Playlist Created:', result);
      }
    }).catch(() => {});
  }
}
