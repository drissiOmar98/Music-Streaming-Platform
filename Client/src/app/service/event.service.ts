import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CardEvent, CreatedEvent, NewEvent, Event, EventVideo, UpdateEventArtistsRequest} from "./model/event.model";
import {State} from "../shared/model/state.model";
import {environment} from "../../environments/environment";
import {createPaginationOption, Page, Pagination} from "../shared/model/request.model";



@Injectable({
  providedIn: 'root'
})
export class EventService {

  http = inject(HttpClient);

  private create$: WritableSignal<State<CreatedEvent>> = signal(State.Builder<CreatedEvent>().forInit());
  createSig = computed(() => this.create$());

  private getAllEvent$: WritableSignal<State<Page<CardEvent>>>
    = signal(State.Builder<Page<CardEvent>>().forInit());
  getAllEventSig = computed(() => this.getAllEvent$());

  private getEventById$: WritableSignal<State<Event>> = signal(State.Builder<Event>().forInit());
  getEventByIdSig = computed(()=> this.getEventById$());

  private getEventContent$: WritableSignal<State<EventVideo>> = signal(State.Builder<EventVideo>().forInit());
  getEventContentSig = computed(() => this.getEventContent$());

  private getEventsByArtist$: WritableSignal<State<Page<CardEvent>>> = signal(State.Builder<Page<CardEvent>>().forInit());
  getEventsByArtistSig = computed(() => this.getEventsByArtist$());

  private getUpcomingEvents$: WritableSignal<State<Page<CardEvent>>> = signal(State.Builder<Page<CardEvent>>().forInit());
  getUpcomingEventsSig = computed(() => this.getUpcomingEvents$());

  private getPastEvents$: WritableSignal<State<Page<CardEvent>>> = signal(State.Builder<Page<CardEvent>>().forInit());
  getPastEventsSig = computed(() => this.getPastEvents$());

  private existsById$: WritableSignal<State<boolean>> = signal(State.Builder<boolean>().forInit());
  existsByIdSig = computed(() => this.existsById$());

  private isArtistInEvent$: WritableSignal<State<boolean>> = signal(State.Builder<boolean>().forInit());
  isArtistInEventSig = computed(() => this.isArtistInEvent$());

  private addArtists$: WritableSignal<State<void>> = signal(State.Builder<void>().forInit());
  addArtistsSig = computed(() => this.addArtists$());

  private removeArtists$: WritableSignal<State<void>> = signal(State.Builder<void>().forInit());
  removeArtistsSig = computed(() => this.removeArtists$());

  private deleteEvent$: WritableSignal<State<void>> = signal(State.Builder<void>().forInit());
  deleteEventSig = computed(() => this.deleteEvent$());

  private updateEvent$: WritableSignal<State<CreatedEvent>> = signal(State.Builder<CreatedEvent>().forInit());
  updateEventSig = computed(() => this.updateEvent$());

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

  updateEvent(eventId: number, updatedEvent: NewEvent): void {
    const formData = new FormData();

    for (let i = 0; i < updatedEvent.pictures.length; i++) {
      formData.append(`picture-${i}`, updatedEvent.pictures[i].file);
    }

    if (updatedEvent.video?.file) {
      formData.append('videoFile', updatedEvent.video.file);
    }

    const clone = {
      ...updatedEvent,
      dateRange: {
        startDateTime: this.formatDate(updatedEvent.dateRange.startDateTime),
        endDateTime: this.formatDate(updatedEvent.dateRange.endDateTime)
      },
      pictures: [],
      video: updatedEvent.video?.file
        ? {
          file: undefined,
          fileContentType: updatedEvent.video.fileContentType,
          videoUrl: null
        }
        : updatedEvent.video?.videoUrl
          ? {
            file: null,
            fileContentType: null,
            videoUrl: updatedEvent.video.videoUrl
          }
          : null
    };

    formData.append('eventRequest', JSON.stringify(clone));

    this.http.put<CreatedEvent>(
      `${environment.API_URL}/events/update/${eventId}`,
      formData
    ).subscribe({
      next: event => this.updateEvent$.set(State.Builder<CreatedEvent>().forSuccess(event)),
      error: err => this.updateEvent$.set(State.Builder<CreatedEvent>().forError(err))
    });
  }

  getAll(pageRequest: Pagination): void {
    let params = createPaginationOption(pageRequest);
    const url = `${environment.API_URL}/events/get-all`;
    this.http.get<Page<CardEvent>>(url, { params })
      .subscribe({
        next: (events) => this.getAllEvent$.set(State.Builder<Page<CardEvent>>().forSuccess(events)),
        error: (error) => {
          this.getAllEvent$.set(State.Builder<Page<CardEvent>>().forError(error));
        }
      });
  }

  // Get event by ID
  getEventById(eventId: number): void {
    this.http.get<Event>(
      `${environment.API_URL}/events/${eventId}`
    ).subscribe({
      next: event => this.getEventById$.set(State.Builder<Event>().forSuccess(event)),
      error: err => this.getEventById$.set(State.Builder<Event>().forError(err))
    });
  }

  // Get events by artist
  getEventsByArtist(artistId: number, pageRequest: Pagination): void {
    const params = createPaginationOption(pageRequest);
    this.http.get<Page<CardEvent>>(
      `${environment.API_URL}/events/artist/${artistId}`,
      { params }
    ).subscribe({
      next: events => this.getEventsByArtist$.set(State.Builder<Page<CardEvent>>().forSuccess(events)),
      error: err => this.getEventsByArtist$.set(State.Builder<Page<CardEvent>>().forError(err))
    });
  }


  // Get event content
  getEventContent(eventId: number): void {
    this.http.get<EventVideo>(
      `${environment.API_URL}/events/get-content?eventId=${eventId}`
    ).subscribe({
      next: content => this.getEventContent$.set(State.Builder<EventVideo>().forSuccess(content)),
      error: err => this.getEventContent$.set(State.Builder<EventVideo>().forError(err))
    });
  }

  // Get upcoming events
  getUpcomingEvents(pageRequest: Pagination): void {
    const params = createPaginationOption(pageRequest);
    this.http.get<Page<CardEvent>>(
      `${environment.API_URL}/events/upcoming`,
      { params }
    ).subscribe({
      next: events => this.getUpcomingEvents$.set(State.Builder<Page<CardEvent>>().forSuccess(events)),
      error: err => this.getUpcomingEvents$.set(State.Builder<Page<CardEvent>>().forError(err))
    });
  }

  // Get past events
  getPastEvents(pageRequest: Pagination): void {
    const params = createPaginationOption(pageRequest);
    this.http.get<Page<CardEvent>>(
      `${environment.API_URL}/events/past`,
      { params }
    ).subscribe({
      next: events => this.getPastEvents$.set(State.Builder<Page<CardEvent>>().forSuccess(events)),
      error: err => this.getPastEvents$.set(State.Builder<Page<CardEvent>>().forError(err))
    });
  }

  // Check if event exists
  existsById(eventId: number): void {
    this.http.get<boolean>(
      `${environment.API_URL}/events/exists/${eventId}`
    ).subscribe({
      next: exists => this.existsById$.set(State.Builder<boolean>().forSuccess(exists)),
      error: err => this.existsById$.set(State.Builder<boolean>().forError(err))
    });
  }

  // Check if artist is in event
  isArtistInEvent(eventId: number, artistId: number): void {
    this.http.get<boolean>(
      `${environment.API_URL}/events/${eventId}/has-artist/${artistId}`
    ).subscribe({
      next: isInEvent => this.isArtistInEvent$.set(State.Builder<boolean>().forSuccess(isInEvent)),
      error: err => this.isArtistInEvent$.set(State.Builder<boolean>().forError(err))
    });
  }

  // Delete event
  deleteEvent(eventId: number): void {
    this.http.delete<void>(
      `${environment.API_URL}/events/${eventId}`
    ).subscribe({
      next: () => this.deleteEvent$.set(State.Builder<void>().forSuccess()),
      error: err => this.deleteEvent$.set(State.Builder<void>().forError(err))
    });
  }

  // Add artists to event
  addArtistsToEvent(request: UpdateEventArtistsRequest): void {
    this.http.post<void>(
      `${environment.API_URL}/events/artists/add`,
      request
    ).subscribe({
      next: () => this.addArtists$.set(State.Builder<void>().forSuccess()),
      error: err => this.addArtists$.set(State.Builder<void>().forError(err))
    });
  }

  // Remove artists from event
  removeArtistsFromEvent(request: UpdateEventArtistsRequest): void {
    this.http.delete<void>(
      `${environment.API_URL}/events/artists/remove`,
      { body: request }
    ).subscribe({
      next: () => this.removeArtists$.set(State.Builder<void>().forSuccess()),
      error: err => this.removeArtists$.set(State.Builder<void>().forError(err))
    });
  }

  // Helper method for date formatting
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

  // Reset methods for all states
  resetCreateState(): void {
    this.create$.set(State.Builder<CreatedEvent>().forInit());
  }

  resetGetAllEvent(): void {
    this.getAllEvent$.set(State.Builder<Page<CardEvent>>().forInit())
  }

  resetGetEventById(): void {
    this.getEventById$.set(State.Builder<Event>().forInit());
  }

  resetGetEventsByArtist(): void {
    this.getEventsByArtist$.set(State.Builder<Page<CardEvent>>().forInit());
  }

  resetGetUpcomingEvents(): void {
    this.getUpcomingEvents$.set(State.Builder<Page<CardEvent>>().forInit());
  }

  resetGetPastEvents(): void {
    this.getPastEvents$.set(State.Builder<Page<CardEvent>>().forInit());
  }

  resetExistsById(): void {
    this.existsById$.set(State.Builder<boolean>().forInit());
  }

  resetIsArtistInEvent(): void {
    this.isArtistInEvent$.set(State.Builder<boolean>().forInit());
  }

  resetAddArtists(): void {
    this.addArtists$.set(State.Builder<void>().forInit());
  }

  resetRemoveArtists(): void {
    this.removeArtists$.set(State.Builder<void>().forInit());
  }

  resetDeleteEvent(): void {
    this.deleteEvent$.set(State.Builder<void>().forInit());
  }

  resetUpdateEvent(): void {
    this.updateEvent$.set(State.Builder<CreatedEvent>().forInit());
  }

  resetGetEventContent(): void {
    this.getEventContent$.set(State.Builder<EventVideo>().forInit());
  }



  constructor() { }
}
