import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {ToastService} from "../../service/toast.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {EventService} from "../../service/event.service";
import {map} from "rxjs";
import {DisplayPicture} from "../../service/model/artist.model";
import {CardEvent, Event, EventVideo} from "../../service/model/event.model";
import {GalleriaModule} from "primeng/galleria";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ButtonDirective} from "primeng/button";
import {NgFor, NgIf} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {ImageModule} from "primeng/image";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {InterestEventBtnComponent} from "../interest-event-btn/interest-event-btn.component";
import {EventAttendeesService} from "../../service/event-attendees.service";
import {EventAttendanceRequest} from "../../service/model/attendance.model";
import {State} from "../model/state.model";

@Component({
  selector: 'app-event-item',
  standalone: true,
  imports: [
    GalleriaModule,
    ProgressSpinnerModule,
    ButtonDirective,
    NgIf,
    NgFor,
    FaIconComponent,
    ImageModule,
    RouterLink,
    InterestEventBtnComponent
  ],
  templateUrl: './event-item.component.html',
  styleUrl: './event-item.component.scss'
})
export class EventItemComponent implements OnInit, OnDestroy  {
  toastService = inject(ToastService);
  activatedRoute = inject(ActivatedRoute);
  eventService = inject(EventService);
  eventAttendeesService = inject(EventAttendeesService);
  sanitizer = inject(DomSanitizer);

  event: Event | undefined;
  cardEvent: CardEvent | undefined;
  coverPicture?: DisplayPicture;

  videoContent: EventVideo | undefined;
  videoObjectUrl: string | null = null; // For storing object URLs for file content
  safeYoutubeUrl: SafeResourceUrl | null = null; // For sanitized YouTube URLs
  videoLoading = true;

  currentEventId!: number;
  loading = true;
  activeIndex: number = 0;
  loadingCreation = false;


  constructor() {
    this.listenToFetchEventDetails();
    this.listenToFetchEventVideoContent();
    this.listenJoinEvent();
    this.listenToLeaveEvent();
  }

  ngOnInit(): void {
    this.extractIdParamFromRouter();
  }


  private extractIdParamFromRouter() {
    this.activatedRoute.paramMap.pipe(
      map(params => params.get('id')),
      map(id => id ? +id : null)
    ).subscribe({
      next: eventId => {
        if (eventId !== null) {
            this.currentEventId=eventId;
          this.fetchEventDetails(eventId);
          this.fetchEventVideoContent(eventId);
        } else {
          this.toastService.
          show("Invalid event ID", "DANGER");
        }
      },
      error: () => {
        this.toastService.
        show("Error extracting event ID", "DANGER");
      }
    });
  }

  private fetchEventDetails(eventId: number) {
    this.loading = true;
    this.currentEventId=eventId;
    this.eventService.getEventById(eventId);
  }

  private fetchEventVideoContent(eventId: number){
    this.videoLoading= true;
    this.currentEventId = eventId;
    this.eventService.getEventContent(eventId);
  }


  private listenToFetchEventDetails() {
    effect(() => {
      const eventByIdState = this.eventService.getEventByIdSig();
      if (eventByIdState.status === "OK") {
        this.loading = false;
        this.event = eventByIdState.value;
        if (this.event) {
          this.event.pictures = this.putCoverPictureFirst(this.event.pictures);
          this.coverPicture = this.event.pictures.length > 0 ? this.event.pictures[0] : undefined;
          this.cardEvent = this.convertEventToCardEvent(this.event);
        }
      } else if (eventByIdState.status === "ERROR") {
        this.loading = false;
        this.toastService.show("Error when fetching the event details", "DANGER");
      }
    });
  }


  private putCoverPictureFirst(pictures: DisplayPicture[]) {
    if (!pictures || pictures.length === 0) return pictures;

    const coverIndex = pictures.findIndex(picture => picture.isCover);
    if (coverIndex > -1) {
      const cover = pictures[coverIndex];
      pictures.splice(coverIndex, 1);
      pictures.unshift(cover);
    }
    return pictures;
  }


  private listenToFetchEventVideoContent() {
    effect(() => {
      const videoState = this.eventService.getEventContentSig();

      if (videoState.status === "OK") {
        this.videoLoading = false;
        this.videoContent = videoState.value;
        this.prepareVideoContent();
      } else if (videoState.status === "ERROR") {
        this.videoLoading = false;
        this.toastService.show("Error loading video content", "DANGER");
      }
    });
  }

  private prepareVideoContent(): void {
    // Clean up previous URLs if they exist
    this.cleanUpVideoResources();

    if (!this.videoContent) return;

    if (this.videoContent.videoUrl) {
      // Handle YouTube URL
      this.safeYoutubeUrl = this.sanitizeYoutubeUrl(this.videoContent.videoUrl);
    } else if (this.videoContent.file) {
      // Handle file content
      this.videoObjectUrl = this.createObjectUrl(this.videoContent.file, this.videoContent.fileContentType);
    }
  }

  private sanitizeYoutubeUrl(url: string): SafeResourceUrl {
    const embedUrl = this.convertToEmbedUrl(url);
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  private createObjectUrl(file: File | Blob | string, contentType?: string): string {
    if (file instanceof File) {
      return URL.createObjectURL(file);
    } else if (file instanceof Blob) {
      return URL.createObjectURL(file);
    } else {
      // Handle base64 string
      const byteCharacters = atob(file);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: contentType });
      return URL.createObjectURL(blob);
    }
  }
  private convertToEmbedUrl(url: string): string {
    // Handle various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }

  private cleanUpVideoResources(): void {
    if (this.videoObjectUrl) {
      URL.revokeObjectURL(this.videoObjectUrl);
      this.videoObjectUrl = null;
    }
    this.safeYoutubeUrl = null;
  }


  private convertEventToCardEvent(event: Event): CardEvent {
    return {
      id: event.id,
      title: event.title,
      location: event.location,
      startDateTime: event.startDateTime,
      endDateTime: event.endDateTime,
      cover: event.pictures.find(picture => picture.isCover) || {} as DisplayPicture,
      artists: event.artists || []
    };
  }

  joinEvent(event : CardEvent) {
    this.loadingCreation = true;
    const request: EventAttendanceRequest = {
      eventId: event.id,
    };
    this.eventAttendeesService.joinEvent(request);
  }

  leaveEvent(event : CardEvent) {
    this.eventAttendeesService.leaveEvent(event.id);
  }

  listenJoinEvent() {
    effect(() => {
      let joinEventState = this.eventAttendeesService.joinEventSig();
      if (joinEventState.status === "OK") {
        this.onJoinedOk(joinEventState);
      } else if (joinEventState.status === "ERROR") {
        this.onJoinedError();
      }
    });
  }

  private listenToLeaveEvent(): void {
    effect(() => {
      let leaveState = this.eventAttendeesService.leaveEventSig();
      if (leaveState.status === 'OK') {
        this.onLeaveOk(leaveState);
      } else if (leaveState.status === 'ERROR') {
        this.onLeaveError();
      }
    });
  }

  onJoinedOk(state: State<void>) {
    this.loadingCreation = false;
    this.toastService.show("Event successfully Joined.", "SUCCESS");
  }

  onJoinedError() {
    this.loadingCreation = false;
    this.toastService.show("Failed to Join this Event.", "DANGER");
  }

  onLeaveOk(removeItemFromFavouriteState: State<void>): void {
    this.loadingCreation = false; // Set loading state to false
    this.toastService.show("Left Event successfully.", "SUCCESS");
  }
  private onLeaveError(): void {
    this.loadingCreation = false; // Set loading state to false
    this.toastService.show("Couldn't Left the event, please try again.", "DANGER")
  }




  ngOnDestroy(): void {
    this.eventService.resetGetEventById();
    this.cleanUpVideoResources();
    this.eventService.resetGetEventContent();
    this.eventAttendeesService.resetJoinEventState();
    this.eventAttendeesService.resetLeaveEventState();
    this.eventAttendeesService.resetAllIsEventInJoinedStates();
  }


}
