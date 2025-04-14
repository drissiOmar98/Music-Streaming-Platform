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

    // 1. Add pictures
    for (let i = 0; i < newEvent.pictures.length; i++) {
      formData.append(`picture-${i}`, newEvent.pictures[i].file);
    }

    // 2. Add video file if exists
    if (newEvent.video?.file) {
      formData.append('videoFile', newEvent.video.file);
    }

    // 3. Create a clean clone for JSON payload
    const clone = {
      ...newEvent,
      dateRange: {
        startDateTime: this.formatDate(newEvent.dateRange.startDateTime),
        endDateTime: this.formatDate(newEvent.dateRange.endDateTime)
      },
      pictures: [], // Remove pictures array
      video: newEvent.video?.file
        ? {
          file: undefined,
          fileContentType: newEvent.video.fileContentType,
          videoUrl: null // Explicitly set to null when file exists
        }
        : newEvent.video?.videoUrl
          ? {
            file: null,
            fileContentType: null,
            videoUrl: newEvent.video.videoUrl
          }
          : null
    };

    // 4. Add JSON payload
    formData.append('eventRequest', JSON.stringify(clone));

    this.http.post<CreatedEvent>(
      `${environment.API_URL}/events/create`,
      formData
    ).subscribe({
      next: event => this.create$.set(State.Builder<CreatedEvent>().forSuccess(event)),
      error: err => this.create$.set(State.Builder<CreatedEvent>().forError(err))
    });
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const hours = ('0' + d.getHours()).slice(-2);
    const minutes = ('0' + d.getMinutes()).slice(-2);
    const seconds = ('0' + d.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  resetCreateState(): void {
    this.create$.set(State.Builder<CreatedEvent>().forInit());
  }


  constructor() { }
}
