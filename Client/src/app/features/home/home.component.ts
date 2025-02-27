import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {ToastService} from "../../service/toast.service";
import {SongService} from "../../service/song.service";
import {ReadSong} from "../../service/model/song.model";
import {SongCardComponent} from "./song-card/song-card.component";
import {SongContentService} from "../../service/song-content.service";
import {FavoriteSongCardComponent} from "./favorite-song-card/favorite-song-card.component";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SongCardComponent,
    FavoriteSongCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnDestroy {

  private songService = inject(SongService);
  private toastService = inject(ToastService);
  private songContentService = inject(SongContentService);


  allSongs: Array<ReadSong> | undefined;



  isLoading = false;


  constructor() {
    this.listenFetchAll()
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

}
