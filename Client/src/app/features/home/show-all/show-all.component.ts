import {Component, effect, inject, OnInit} from '@angular/core';
import {SongCardComponent} from "../song-card/song-card.component";
import {ArtistCardComponent} from "../artist-card/artist-card.component";
import {HomeCategoryComponent} from "../home-category/home-category.component";
import {Artist, CardArtist} from "../../../service/model/artist.model";
import {Section} from "../../../service/model/section.model";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {ReadSong} from "../../../service/model/song.model";
import {SongService} from "../../../service/song.service";
import {ToastService} from "../../../service/toast.service";
import {ArtistService} from "../../../service/artist.service";
import {Router} from "@angular/router";
import {SectionService} from "../../../service/section.service";
import {SongContentService} from "../../../service/song-content.service";

@Component({
  selector: 'app-show-all',
  standalone: true,
  imports: [
    SongCardComponent,
    ArtistCardComponent,
    HomeCategoryComponent,
    NgForOf,
    NgIf,
    NgStyle
  ],
  templateUrl: './show-all.component.html',
  styleUrl: './show-all.component.scss'
})
export class ShowAllComponent implements OnInit {

  songService = inject(SongService);
  toastService= inject(ToastService);
  artistService = inject(ArtistService);
  sectionService = inject(SectionService);
  songContentService = inject(SongContentService)
  router = inject(Router);

  section: Section | undefined;
  artists: CardArtist[] = [];
  songs: ReadSong[] = [];
  // playlists: Playlist[] = [];
  // albums: Album[] = [];


  isLoading = false;

  constructor() {
    // Listen to signal changes
    this.listenFetchArtists();
    this.listenFetchSongs();
    //this.listenFetchPlaylists();
    //this.listenFetchAlbums();
  }


  ngOnInit(): void {
    const state = this.router.getCurrentNavigation()?.extras.state;
    this.section = state?.['section'] || this.sectionService.getSection(); // Retrieve from service if missing
    console.log('Loaded Section:', this.section);
    if (this.section) {
      this.loadItems();
    } else {
      console.error('No section data found.');
    }
  }

  onPlaySong(songToPlayFirst: ReadSong) {
    this.songContentService.createNewQueue(songToPlayFirst, this.songs!);
  }







  loadItems() {
    this.isLoading = true;
    if (this.section?.type === 'artist') {
      this.artistService.getAll({ size: 100, page: 0, sort: ['name', 'ASC'] });
    } else if (this.section?.type === 'song') {
      this.songService.getSongs();
    } else if (this.section?.type === 'playlist') {
      //this.playlistService.getPlaylists();
    } else if (this.section?.type === 'album') {
      //this.albumService.getAlbums();
    }
  }

  private listenFetchArtists() {
    effect(() => {
      const allArtistState = this.artistService.getAllArtistSig();
      if (allArtistState.status === 'OK' && allArtistState.value) {
        this.artists = allArtistState.value.content || [];
        this.isLoading = false;
      } else if (allArtistState.status === 'ERROR') {
        this.toastService.show('Error when fetching artists.', 'DANGER');
        this.isLoading = false;
      }
    });
  }

  private listenFetchSongs() {
    effect(() => {
      const allSongsResponse = this.songService.getAllSig();
      if (allSongsResponse.status === 'OK') {
        this.songs = allSongsResponse.value || [];
        this.isLoading = false;
      } else if (allSongsResponse.status === 'ERROR') {
        this.toastService.show('An error occurred when fetching songs.', 'DANGER');
        this.isLoading = false;
      }
    });
  }



}
