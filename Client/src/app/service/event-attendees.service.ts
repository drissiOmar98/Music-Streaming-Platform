import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {State} from "../shared/model/state.model";
import {environment} from "../../environments/environment";
import {EventAttendance, EventAttendanceRequest} from "./model/attendance.model";


@Injectable({
  providedIn: 'root'
})
export class EventAttendeesService {

  http = inject(HttpClient);

  private getJoinedEvents$: WritableSignal<State<Array<EventAttendance>>> = signal(State.Builder<Array<EventAttendance>>().forInit());
  getJoinedEventsSig = computed(() => this.getJoinedEvents$());

  private joinEvent$: WritableSignal<State<void>> = signal(State.Builder<void>().forInit());
  joinEventSig = computed(() => this.joinEvent$());

  private leaveEvent$: WritableSignal<State<void>> = signal(State.Builder<void>().forInit());
  leaveEventSig = computed(() => this.leaveEvent$());

  private clearParticipation$: WritableSignal<State<void>> = signal(State.Builder<void>().forInit());
  clearParticipationSig = computed(() => this.clearParticipation$());

  private joinedEventsCount$: WritableSignal<number> = signal(0);
  followersCountSig = computed(() => this.joinedEventsCount$());

  private isEventInJoinedMap$: Map<number, WritableSignal<State<boolean>>> = new Map();


  getIsEventInJoinedListSignal(eventId: number): WritableSignal<State<boolean>> {
    if (!this.isEventInJoinedMap$.has(eventId)) {
      this.isEventInJoinedMap$.set(eventId, signal(State.Builder<boolean>().forInit()));
    }
    return this.isEventInJoinedMap$.get(eventId)!;
  }

  checkEventInFollowedList(eventId: number): void {
    const eventJoinedStateSignal = this.getIsEventInJoinedListSignal(eventId);
    this.http
      .get<boolean>(`${environment.API_URL}/attendances/check/${eventId}`)
      .subscribe({
        next: (isJoined) => {
          eventJoinedStateSignal.set(State.Builder<boolean>().forSuccess(isJoined));
        },
        error: (err) => {
          eventJoinedStateSignal.set(State.Builder<boolean>().forError(err));
        },
      });
  }

  updateJoinedEventCount(): void {
    const state = this.getJoinedEvents$();
    if (state.status === 'OK' && state.value) {
      this.joinedEventsCount$.set(state.value.length);
    } else {
      this.joinedEventsCount$.set(0);
    }
  }

  joinEvent(request: EventAttendanceRequest): void {
    this.http.post<void>(`${environment.API_URL}/attendances/join`, request)
      .subscribe({
        next: () => {
          this.joinEvent$.set(State.Builder<void>().forSuccess());
          this.getJoinedEvents();
          this.resetLeaveEventState();
        },
        error: (err) => {
          this.joinEvent$.set(State.Builder<void>().forError(err));
        }
      });
  }

  getJoinedEvents(): void {
    this.http.get<Array<EventAttendance>>(`${environment.API_URL}/attendances/joined-events`)
      .subscribe({
        next: joinedEvents => {
          this.getJoinedEvents$.set(State.Builder<Array<EventAttendance>>().forSuccess(joinedEvents));
          this.updateJoinedEventCount();
        },
        error: err => this.getJoinedEvents$.set(State.Builder<Array<EventAttendance>>().forError(err)),
      });
  }

  clearParticipation(): void {
    this.http.delete<void>(`${environment.API_URL}/attendances/clear`)
      .subscribe({
        next: () => {
          this.clearParticipation$.set(State.Builder<void>().forSuccess());
          this.updateJoinedEventCount();
        },
        error: (err) => {
          this.clearParticipation$.set(State.Builder<void>().forError(err));
        }
      });
  }

  leaveEvent(eventId: number): void {
    this.http.delete<void>(`${environment.API_URL}/attendances/leave/${eventId}`)
      .subscribe({
        next: () => {
          this.leaveEvent$.set(State.Builder<void>().forSuccess());
          this.getJoinedEvents();
          this.updateJoinedEventCount();
        },
        error: (err) => {
          this.leaveEvent$.set(State.Builder<void>().forError(err));
        }
      });
  }

  resetGetJoinedEventsState(): void {
    this.getJoinedEvents$.set(State.Builder<Array<EventAttendance>>().forInit());
  }


  resetJoinEventState(): void {
    this.joinEvent$.set(State.Builder<void>().forInit());
  }


  resetLeaveEventState(): void {
    this.leaveEvent$.set(State.Builder<void>().forInit());
  }


  resetClearParticipationState(): void {
    this.clearParticipation$.set(State.Builder<void>().forInit());
  }




  resetAllIsEventInJoinedStates(): void {
    this.isEventInJoinedMap$.forEach(signal => {
      signal.set(State.Builder<boolean>().forInit());
    });
  }

  constructor() {
    this.getJoinedEvents();
  }
}
