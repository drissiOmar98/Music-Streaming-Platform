import {Component, EventEmitter, inject, input, Output} from '@angular/core';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {animate, style, transition, trigger} from "@angular/animations";
import {Router} from "@angular/router";
import {CardEvent} from "../../../service/model/event.model";
import {DatePipe, UpperCasePipe} from "@angular/common";

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [
    FontAwesomeModule,
    DatePipe,
    UpperCasePipe
  ],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss',
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
export class EventCardComponent {
  router = inject(Router);

  event = input.required<CardEvent>();
  eventDisplay: Partial<CardEvent> & { displayDate?: boolean } = { displayDate: false };


  onHoverDate(displayDate: boolean): void {
    this.eventDisplay.displayDate = displayDate;
  }

  navigateToEventDetails() {
    this.router.navigate(['/event-item', this.event().id]);
  }
}
