import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {ToastService} from "../../service/toast.service";
import {SongService} from "../../service/song.service";
import {ReadSong} from "../../service/model/song.model";
import {SongCardComponent} from "./song-card/song-card.component";
import {SongContentService} from "../../service/song-content.service";
import {FavoriteSongCardComponent} from "./favorite-song-card/favorite-song-card.component";
import {ArtistCardComponent} from "./artist-card/artist-card.component";
import {CardArtist} from "../../service/model/artist.model";
import {ArtistService} from "../../service/artist.service";
import {Pagination} from "../../shared/model/request.model";
import {Section} from "../../service/model/section.model";
import {HomeCategoryComponent} from "./home-category/home-category.component";
import {NgForOf, NgIf} from "@angular/common";
import {CardEvent} from "../../service/model/event.model";
import {EventService} from "../../service/event.service";
import {EventCardComponent} from "./event-card/event-card.component";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SongCardComponent,
    FavoriteSongCardComponent,
    ArtistCardComponent,
    HomeCategoryComponent,
    NgIf,
    NgForOf,
    EventCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

  private songService = inject(SongService);
  private toastService = inject(ToastService);
  private songContentService = inject(SongContentService);
  artistService = inject (ArtistService);
  eventService = inject(EventService);


  allSongs: Array<ReadSong> | undefined;
  fullArtistList: Array<CardArtist> = [];
  artists: Array<CardArtist> | undefined = [];
  pageRequest: Pagination = {size: 20, page: 0, sort: ["name", "ASC"]};

  fullEventList: Array<CardEvent> = [];
  events: Array<CardEvent> | undefined = [];
  loadingFetchAllEvents = false;
  pageRequestEvent: Pagination = {size: 20, page: 0, sort: ["title", "ASC"]};

  loadingFetchAll = false;
  isLoading = false;


  sections: Section[] = [
    { section: 'Popular Artists', type: 'artist', category: 'null' },
    { section: 'Popular Songs', type: 'song', category: 'null' },
    { section: 'My Playlists', type: 'playlist', category: 'null' },
    { section: 'Upcoming Events', type: 'event', category: 'null' },
  ];

  ngOnInit(): void {
    this.artistRandom();
    this.fetchSongs();
    this.fetchEvents();
  }


  constructor() {
    this.listenFetchAll();
    this.listenFetchArtists();
    this.listenFetchEvents();
  }

  private listenFetchAll() {
    this.isLoading = true;
    effect(() => {
      const allSongsResponse = this.songService.getAllSig();
      if (allSongsResponse.status === "OK"  ) {
        this.allSongs = allSongsResponse.value;
      } else if (allSongsResponse.status === "ERROR") {
        this.toastService.show('An error occurred when fetching all songs', "DANGER");
      }
      this.isLoading = false;
    });
  }

  onPlaySong(songToPlayFirst: ReadSong) {
    this.songContentService.createNewQueue(songToPlayFirst, this.allSongs!);
  }

  ngOnDestroy(): void {
    this.songService.resetGetAllState();
    this.eventService.resetGetAllEvent();
    this.artistService.resetGetAllArtist();
  }

  private artistRandom() {
    this.loadingFetchAll = true;
    this.artistService.getAll(this.pageRequest);
  }

  private fetchEvents(){
    this.loadingFetchAllEvents=true;
    this.eventService.getAll(this.pageRequestEvent);

  }

  private fetchSongs() {
    this.isLoading = true;
    this.songService.getSongs();
  }

  private listenFetchArtists() {
    effect(() => {
      const allArtistState = this.artistService. getAllArtistSig();
      if (allArtistState.status === "OK" && allArtistState.value) {
        this.loadingFetchAll = false;
        this.fullArtistList = allArtistState.value?.content || [];
        this.artists = [...this.fullArtistList];
      } else if (allArtistState.status === "ERROR") {
        this.toastService.show("Error when fetching the artists.", "DANGER");
      }
    });
  }

  private listenFetchEvents() {
    effect(() => {
      const allEventState = this.eventService.getAllEventSig();
      if (allEventState.status === "OK" && allEventState.value) {
        this.loadingFetchAllEvents = false;
        this.fullEventList = allEventState.value?.content || [];
        this.events = [...this.fullEventList];
      } else if (allEventState.status === "ERROR") {
        this.toastService.show("Error when fetching the events.", "DANGER");
      }
    });
  }


  showAllArtists() {

  }




}
