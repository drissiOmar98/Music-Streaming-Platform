import { Component } from '@angular/core';
import {LikedDetailsComponent} from "../liked-details/liked-details.component";
import {ListLikedSongComponent} from "../list-liked-song/list-liked-song.component";

@Component({
  selector: 'app-liked',
  standalone: true,
  imports: [
    LikedDetailsComponent,
    ListLikedSongComponent
  ],
  templateUrl: './liked.component.html',
  styleUrl: './liked.component.scss'
})
export class LikedComponent {

}
