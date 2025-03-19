import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {PlaylistDetailsComponent} from "../playlist-details/playlist-details.component";
import {ListPlaylistSongComponent} from "../list-playlist-song/list-playlist-song.component";
import {Playlist} from "../../../service/model/playlist.model";
import {ActivatedRoute} from "@angular/router";
import {ToastService} from "../../../service/toast.service";
import {PlaylistService} from "../../../service/playlist.service";
import {map} from "rxjs";
import {ReadSong} from "../../../service/model/song.model";

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [
    PlaylistDetailsComponent,
    ListPlaylistSongComponent
  ],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.scss'
})
export class PlaylistComponent  implements OnInit, OnDestroy {

  activatedRoute = inject(ActivatedRoute);
  toastService = inject(ToastService);
  playlistService = inject(PlaylistService);

  playlist: Playlist | undefined;
  loading = true;

  constructor() {
    this.listenToFetchPlaylistInfo();
  }

  ngOnInit(): void {
    this.extractIdParamFromRouter();
  }

  private extractIdParamFromRouter() {
    this.activatedRoute.paramMap.pipe(
      map(params => params.get('id')),
      map(id => id ? +id : null)
    ).subscribe({
      next: id => {
        if (id !== null) {
          this.fetchPlaylistById(id);
        } else {
          console.error('Invalid playlist ID');
        }
      },
      error: err => {
        console.error('Error extracting playlist ID:', err);
      }
    });
  }

  private fetchPlaylistById(playlistId: number) {
    this.playlistService.getPlaylistById(playlistId);
  }

  private listenToFetchPlaylistInfo() {
    effect(() => {
      const playlistInfoState = this.playlistService.getByIdSig();
      if (playlistInfoState.status === "OK") {
        this.loading = false;
        this.playlist =  playlistInfoState.value;
      } else if (playlistInfoState.status === "ERROR") {
        this.loading = false;
        this.toastService.show("Error when fetching the Playlist", "DANGER");
      }
    });
  }

  ngOnDestroy(): void {
    // Reset the playlist state in the service
    this.playlistService.resetGetByIdState();
  }


}
