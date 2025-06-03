import {Component, effect, EventEmitter, inject, input, OnInit, Output} from '@angular/core';
import {ToastService} from "../../service/toast.service";
import {EventAttendeesService} from "../../service/event-attendees.service";
import {CardArtist} from "../../service/model/artist.model";
import {CardEvent} from "../../service/model/event.model";
import {State} from "../model/state.model";
import {NgClass, NgIf} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-interest-event-btn',
  standalone: true,
  imports: [
    NgClass,
    FaIconComponent,
    NgIf
  ],
  templateUrl: './interest-event-btn.component.html',
  styleUrl: './interest-event-btn.component.scss'
})
export class InterestEventBtnComponent  implements OnInit {

  eventAttendeesService = inject(EventAttendeesService);
  toastService = inject(ToastService);

  @Output() joinEvent = new EventEmitter<CardEvent>();
  @Output() leaveEvent = new EventEmitter<CardEvent>();

  event = input.required<CardEvent>();

  isJoined: Map<number, boolean> = new Map();

  constructor() {
    this.listenCheckIfEventIsJoined();
  }


  ngOnInit(): void {
    this.checkEventInJoinedList(this.event().id);
  }

  private listenCheckIfEventIsJoined(): void {
    effect(() => {
      const eventStateSignal = this.eventAttendeesService.getIsEventInJoinedListSignal(this.event().id);
      const state = eventStateSignal();
      if (state.status === "OK") {
        this.isJoined.set(this.event().id, state.value ?? false);
      } else if (state.status === "ERROR") {
        this.toastService.show("Failed to check event participation status", "DANGER");
      }
    });
  }

  private checkEventInJoinedList(eventId: number): void {
    this.eventAttendeesService.checkEventInFollowedList(eventId);
  }

  joinOrLeaveEvent(event: CardEvent): void {
    if (this.isJoined.get(event.id)) {
      this.leaveEvent.emit(event);
      this.eventAttendeesService.getIsEventInJoinedListSignal(event.id).set(State.Builder<boolean>().forSuccess(false));
    } else {
      this.joinEvent.emit(event);
      this.eventAttendeesService.getIsEventInJoinedListSignal(event.id).set(State.Builder<boolean>().forSuccess(true));
    }
  }

  getButtonClass(eventId: number): string {
    const isEventJoined: boolean | undefined = this.isJoined.get(eventId);
    return isEventJoined ? 'interest-btn joined' : 'interest-btn';
  }


  protected readonly faCheck = faCheck;
}
