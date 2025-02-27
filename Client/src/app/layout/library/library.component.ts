import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {RouterModule} from "@angular/router";
import {SongService} from "../../service/song.service";
import {ReadSong} from "../../service/model/song.model";
import {SongContentService} from "../../service/song-content.service";
import {SmallSongCardComponent} from "../../shared/small-song-card/small-song-card.component";

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [
    FontAwesomeModule, RouterModule, SmallSongCardComponent,
  ],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss'
})
export class LibraryComponent implements OnInit, OnDestroy {

  songService = inject(SongService);
  songContentService = inject(SongContentService);

  isLoading = false;

  songs: Array<ReadSong> = [];

  constructor() {
    this.listenFetchAll()

  }

  ngOnInit(): void {
    this.fetchSongs();
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

  ngOnDestroy(): void {
    this.songService.resetGetAllState();
  }



}
