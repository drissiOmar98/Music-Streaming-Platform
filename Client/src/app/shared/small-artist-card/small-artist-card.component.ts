import {Component, inject, input} from '@angular/core';
import {CardArtist} from "../../service/model/artist.model";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {Router} from "@angular/router";

@Component({
  selector: 'app-small-artist-card',
  standalone: true,
  imports: [
    FaIconComponent
  ],
  templateUrl: './small-artist-card.component.html',
  styleUrl: './small-artist-card.component.scss'
})
export class SmallArtistCardComponent {

  router = inject(Router);

  artist = input.required<CardArtist>();

  navigateToArtistDetails(): void {
    this.router.navigate(['/artist', this.artist().id]);
  }

}
