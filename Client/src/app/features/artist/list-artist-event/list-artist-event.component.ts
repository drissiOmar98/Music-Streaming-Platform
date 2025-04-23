import {Component, inject, Input} from '@angular/core';
import {Artist} from "../../../service/model/artist.model";
import {ToastService} from "../../../service/toast.service";
import {Router} from "@angular/router";
import {EventService} from "../../../service/event.service";
import {DatePipe, NgForOf, NgIf, UpperCasePipe} from "@angular/common";
import {ReadSong} from "../../../service/model/song.model";
import {CardEvent} from "../../../service/model/event.model";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-list-artist-event',
  standalone: true,
  imports: [
    NgIf,
    DatePipe,
    NgForOf,
    FaIconComponent,
    UpperCasePipe
  ],
  templateUrl: './list-artist-event.component.html',
  styleUrl: './list-artist-event.component.scss'
})
export class ListArtistEventComponent {
  eventService = inject(EventService);
  toastService = inject(ToastService);
  router = inject(Router);

  @Input() artist: Artist | undefined;
  @Input() artistEvents: Array<CardEvent> | undefined = [];

  viewEventDetails(event: CardEvent) {
    // Implement navigation to event details
    console.log('View event details:', event);
    // You might want to navigate to an event details page
    // this.router.navigate(['/event', event.id]);
  }

}
