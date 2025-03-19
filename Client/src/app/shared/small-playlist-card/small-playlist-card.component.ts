import {Component, inject, input} from '@angular/core';
import {Router} from "@angular/router";
import {Playlist} from "../../service/model/playlist.model";

@Component({
  selector: 'app-small-playlist-card',
  standalone: true,
  imports: [],
  templateUrl: './small-playlist-card.component.html',
  styleUrl: './small-playlist-card.component.scss'
})
export class SmallPlaylistCardComponent {

  router = inject(Router);

  playlist = input.required<Playlist>();

  navigateToPlaylistDetails(): void {
    this.router.navigate(['/playlist', this.playlist().id]);
  }

}
