import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CreatedEvent, NewEvent} from "./model/event.model";
import {State} from "../shared/model/state.model";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  http = inject(HttpClient);

  private create$: WritableSignal<State<CreatedEvent>> = signal(State.Builder<CreatedEvent>().forInit());
  createSig = computed(() => this.create$());

  createEvent(newEvent: NewEvent): void {
    const formData = new FormData();

    // 1. Add pictures with indexed names
    for (let i = 0; i < newEvent.pictures.length; i++) {
      formData.append(`picture-${i}`, newEvent.pictures[i].file);
    }

    // 2. Add video file if exists
    if (newEvent.video?.file) {
      formData.append('videoFile', newEvent.video.file!);
    }

    // 3. Clean clone before JSON serialization
    const clone = structuredClone(newEvent);
    clone.pictures = []; // Remove pictures array from JSON
    if (clone.video?.file!) {
      clone.video.file = undefined;
    }

    // 4. Add JSON payload
    formData.append('eventRequest', JSON.stringify(clone));

    this.http.post<CreatedEvent>(
      `${environment.API_URL}/api/v1/events/create`,
      formData
    ).subscribe({
      next: event => this.create$.set(State.Builder<CreatedEvent>().forSuccess(event)),
      error: err => this.create$.set(State.Builder<CreatedEvent>().forError(err))
    });

  }

  resetCreateState(): void {
    this.create$.set(State.Builder<CreatedEvent>().forInit());
  }


  constructor() { }
}
