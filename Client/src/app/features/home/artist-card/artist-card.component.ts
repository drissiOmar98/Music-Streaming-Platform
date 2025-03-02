import {Component, EventEmitter, inject, input, Output} from '@angular/core';

import {CardArtist} from "../../../service/model/artist.model";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {animate, style, transition, trigger} from "@angular/animations";
import {NgIf} from "@angular/common";
import {Router} from "@angular/router";


@Component({
  selector: 'app-artist-card',
  standalone: true,
  imports: [
    FaIconComponent,
    NgIf
  ],
  templateUrl: './artist-card.component.html',
  styleUrl: './artist-card.component.scss',
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({transform: 'translateY(10px)', opacity: 0}),
            animate('.2s ease-out',
              style({transform: 'translateY(0px)', opacity: 1}))
          ]
        ),
        transition(
          ':leave',
          [
            style({transform: 'translateY(0px)', opacity: 1}),
            animate('.2s ease-in',
              style({transform: 'translateY(10px)', opacity: 0}))
          ]
        ),
      ]
    )
  ]

})
export class ArtistCardComponent {

  router = inject(Router);

  artist = input.required<CardArtist>();
  isHovered = false; // Track hover state locally

  @Output() artistToPlay$ = new EventEmitter<CardArtist>();

  onHoverPlay(displayIcon: boolean): void {
    this.isHovered = displayIcon;
  }

  play(): void {
    this.artistToPlay$.next(this.artist());
  }

  navigateToArtistDetails(): void {
    this.router.navigate(['/artist', this.artist().id]);
  }
}
