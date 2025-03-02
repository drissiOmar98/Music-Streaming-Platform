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


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SongCardComponent,
    FavoriteSongCardComponent,
    ArtistCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

  private songService = inject(SongService);
  private toastService = inject(ToastService);
  private songContentService = inject(SongContentService);
  artistService = inject (ArtistService);


  allSongs: Array<ReadSong> | undefined;
  fullArtistList: Array<CardArtist> = [];
  artists: Array<CardArtist> | undefined = [];
  pageRequest: Pagination = {size: 20, page: 0, sort: ["name", "ASC"]};

  loadingFetchAll = false;



  isLoading = false;


  constructor() {
    this.listenFetchAll();
    this.listenFetchArtists();
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
  }

  private artistRandom() {
    this.loadingFetchAll = true;
    this.artistService.getAll(this.pageRequest);
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


  showAllArtists() {

  }

  ngOnInit(): void {
    this.artistRandom();
  }
}
