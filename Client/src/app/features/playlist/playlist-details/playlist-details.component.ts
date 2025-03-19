import {Component, Input} from '@angular/core';
import {Playlist} from "../../../service/model/playlist.model";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-playlist-details',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './playlist-details.component.html',
  styleUrl: './playlist-details.component.scss'
})
export class PlaylistDetailsComponent {

  @Input("playlist") playlist : Playlist | undefined;


  showEditDetails = false;

  toggleEditPlaylistName() {
    this.showEditDetails = !this.showEditDetails;
  }



}
