import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {ToastService} from "../../../service/toast.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Artist, CardArtist, DisplayPicture} from "../../../service/model/artist.model";
import {ArtistService} from "../../../service/artist.service";
import {map} from "rxjs";
import {NgClass, NgIf, NgStyle} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {ListArtistSongComponent} from "../list-artist-song/list-artist-song.component";
import {SongService} from "../../../service/song.service";
import {ReadSong} from "../../../service/model/song.model";
import {SongContentService} from "../../../service/song-content.service";
import {FollowArtistBtnComponent} from "../../../shared/follow-artist-btn/follow-artist-btn.component";
import {FollowRequest} from "../../../service/model/follow.model";
import {FollowService} from "../../../service/follow.service";
import {State} from "../../../shared/model/state.model";
import {PlaybackService} from "../../../service/playback.service";
import {ListArtistEventComponent} from "../list-artist-event/list-artist-event.component";
import {EventService} from "../../../service/event.service";
import {CardEvent} from "../../../service/model/event.model";
import {Pagination} from "../../../shared/model/request.model";

@Component({
  selector: 'app-artist-details',
  standalone: true,
  imports: [
    NgClass,
    NgStyle,
    NgIf,
    FaIconComponent,
    ListArtistSongComponent,
    FollowArtistBtnComponent,
    ListArtistEventComponent
  ],
  templateUrl: './artist-details.component.html',
  styleUrl: './artist-details.component.scss'
})
export class ArtistDetailsComponent implements OnInit , OnDestroy   {

  toastService = inject(ToastService);
  artistService = inject(ArtistService);
  songService = inject(SongService);
  followService = inject(FollowService);
  playbackService = inject(PlaybackService);
  eventService = inject(EventService);
  songContentService = inject(SongContentService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  artist: Artist | undefined;
  cardArtist: CardArtist | undefined;
  songs: Array<ReadSong> = [];
  fullEventList: Array<CardEvent> = [];
  events: Array<CardEvent> | undefined = [];
  loadingFetchAll = false;
  pageRequest: Pagination = {size: 20, page: 0, sort: ["title", "ASC"]};
  loading = true;
  currentArtistId!: number;
  activeIndex: number = 0;
  displayCustom!: boolean;
  coverPicture?: DisplayPicture;
  profilePicture?: DisplayPicture;
  showPlayButton: boolean = false;
  loadingCreation = false;
  showPlayPlaylist = false; // Toggle play/pause button

  ngOnInit(): void {
    this.extractIdParamFromRouter();
    this.playbackService.isPlaying$.subscribe(state => {
      // Check if the current artist is the one being played
      if (this.artist && state.artistId === this.artist.id) {
        this.showPlayPlaylist = state.isPlaying;
      } else {
        this.showPlayPlaylist = false; // Reset for other artists
      }
    });
  }


  ngOnDestroy(): void {
    this.followService.resetAllIsArtistInFollowedStates();
    this.followService.resetFollowArtistState();
    this.followService.resetUnfollowArtistState();
    this.eventService.resetGetEventsByArtist();
  }


  constructor() {
    this.listenToFetchArtist();
    this.listenToFetchSongs();
    this.listenToFetchEvents();
    this.listenFollowArtist();
    this.listenToUnfollowArtist();
  }

  private extractIdParamFromRouter() {
    this.activatedRoute.paramMap.pipe(
      map(params => params.get('id')),
      map(id => id ? +id : null)
    ).subscribe({
      next: artistId => {
        if (artistId !== null) {
          this.currentArtistId=artistId;
          this.fetchArtistDetails(artistId);
          this.fetchSongsByArtist(artistId);
          this.fetchEventsByArtist(artistId);
        } else {
          this.toastService.
          show("Invalid artist ID", "DANGER");
        }
      },
      error: () => {
        this.toastService.
        show("Error extracting artist ID", "DANGER");
      }
    });
  }

  private fetchArtistDetails(artistId: number) {
    this.loading = true;
    this.currentArtistId=artistId;
    this.artistService.getArtistById(artistId);
  }
  private fetchSongsByArtist(artistId: number) {
    this.songService.getSongsByArtist(artistId);
  }

  private fetchEventsByArtist(artistId: number) {
    this.eventService.getEventsByArtist(artistId,this.pageRequest);
  }



  private listenToFetchArtist() {
    effect(() => {
      const artistByIdState = this.artistService.getArtistByIdSig();
      if (artistByIdState.status === "OK") {
        this.loading = false;
        this.artist = artistByIdState.value;
        // Convert Artist to CardArtist

        if (this.artist) {
          this.artist.pictures = this.putCoverPictureFirst(this.artist.pictures);

          // Assign the first picture as profilePicture
          this.coverPicture = this.artist.pictures.length > 0 ? this.artist.pictures[0] : undefined;

          // Assign the last picture as coverPicture
          this.profilePicture = this.artist.pictures.length > 1 ? this.artist.pictures[this.artist.pictures.length - 1] : this.profilePicture;

          this.cardArtist = this.convertArtistToCardArtist(this.artist);

          // Check if the artist is followed
          //this.followService.checkArtistInFollowedList(this.cardArtist.id);
        }
      } else if (artistByIdState.status === "ERROR") {
        this.loading = false;
        this.toastService.show("Error when fetching the artist", "DANGER");
      }
    });
  }


  private putCoverPictureFirst(pictures: Array<DisplayPicture>) {
    if (!pictures || pictures.length === 0) return pictures;

    const coverIndex = pictures.findIndex(picture => picture.isCover);

    if (coverIndex !== -1) {
      const cover = pictures.splice(coverIndex, 1)[0];
      pictures.push(cover); // Put the cover picture at the end
    }

    return pictures;
  }

  private listenToFetchSongs() {
    effect(() => {
      const songsByArtistState = this.songService.getSongsByArtistSig();
      if (songsByArtistState.status === "OK") {
        // Use ?? to provide a fallback empty array if songsByArtistState.value is undefined
        this.songs = songsByArtistState.value ?? [];
      } else if (songsByArtistState.status === "ERROR") {
        this.toastService.show("Error fetching songs", "DANGER");
      }
    });
  }

  private listenToFetchEvents() {
    effect(() => {
      const eventsByArtistState = this.eventService.getEventsByArtistSig();
      if (eventsByArtistState.status === "OK") {
        this.loadingFetchAll = false;
        this.fullEventList = eventsByArtistState.value?.content || [];
        this.events = [...this.fullEventList];
      } else if (eventsByArtistState.status === "ERROR") {
        this.toastService.show("Error fetching events", "DANGER");
      }
    });
  }




  imageClick(index: number) {
    this.activeIndex = index;
    this.displayCustom = true;
  }

  onPlaySong(songToPlayFirst: ReadSong) {
    this.songContentService.createNewQueue(songToPlayFirst, this.songs!);
  }

  followArtist(artist : CardArtist) {
    this.loadingCreation = true;
    const request: FollowRequest = {
      artistId: artist.id,
    };
    this.followService.followArtist(request);
  }

  unfollowArtist(artist: CardArtist) {
    this.followService.unfollowArtist(artist.id);
  }

  private convertArtistToCardArtist(artist: Artist): CardArtist {
    return {
      id: artist.id,
      name: artist.name,
      bio: artist.bio,
      cover: artist.pictures.find(picture => picture.isCover) || {} as DisplayPicture
    };
  }

  listenFollowArtist() {
    effect(() => {
      let followState = this.followService.followArtistSig();
      if (followState.status === "OK") {
        this.onFollowAdditionOk(followState);
      } else if (followState.status === "ERROR") {
        this.onFollowAdditionError();
      }
    });
  }

  private listenToUnfollowArtist(): void {
    effect(() => {
      let unFollowState = this.followService.unfollowArtistSig();
      if (unFollowState.status === 'OK') {
        this.onFollowRemovalOk(unFollowState);
      } else if (unFollowState.status === 'ERROR') {
        this.onFollowRemovalError();
      }
    });
  }

  onFollowAdditionOk(state: State<void>) {
    this.loadingCreation = false;
    this.toastService.show("Artist successfully Followed.", "SUCCESS");
  }

  onFollowAdditionError() {
    this.loadingCreation = false;
    this.toastService.show("Failed to Follow this Artist.", "DANGER");
  }

  onFollowRemovalOk(removeItemFromFavouriteState: State<void>): void {
    this.loadingCreation = false; // Set loading state to false
    this.toastService.show("Unfollowed successfully.", "SUCCESS");
  }
  private onFollowRemovalError(): void {
    this.loadingCreation = false; // Set loading state to false
    this.toastService.show("Couldn't Unfollow the artist, please try again.", "DANGER")
  }

  // Add this method to handle play/pause logic
  togglePlayPausePlaylist(): void {
    this.showPlayPlaylist = !this.showPlayPlaylist;
    this.playbackService.setPlayingState(this.artist?.id, this.showPlayPlaylist);

    // If the playlist is set to play and there are songs, play the first song
    if (this.showPlayPlaylist && this.songs && this.songs.length > 0) {
      const firstSong = this.songs[0];
      this.songContentService.createNewQueue(firstSong, this.songs);
    }
  }




}
