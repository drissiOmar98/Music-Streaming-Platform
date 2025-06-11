import {Component, effect, inject, input, Input, OnDestroy, OnInit, signal} from '@angular/core';
import {DisplayPicture} from "../../../../../service/model/artist.model";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {CardEvent, Event, EventVideo} from "../../../../../service/model/event.model";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {ToastService} from "../../../../../service/toast.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {EventService} from "../../../../../service/event.service";
import {FormsModule} from "@angular/forms";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";


@Component({
  selector: 'app-event-details-modal',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    FormsModule,
    DatePipe,
    FaIconComponent
  ],
  templateUrl: './event-details-modal.component.html',
  styleUrl: './event-details-modal.component.scss'
})
export class EventDetailsModalComponent implements OnInit, OnDestroy  {

  activeModal = inject(NgbActiveModal);
  toastService = inject(ToastService);
  eventService = inject(EventService);
  sanitizer = inject(DomSanitizer);

  // Input signal for the event ID
  @Input() eventId!: number;

  // Event data
  event: Event | undefined;
  cardEvent: CardEvent | undefined;
  coverPicture?: DisplayPicture;

  // Video content
  videoContent: EventVideo | undefined;
  videoObjectUrl: string | null = null; // For storing object URLs for file content
  safeYoutubeUrl: SafeResourceUrl | null = null; // For sanitized YouTube URLs
  videoLoading = true;

  // Loading states
  loading = true;
  activeIndex: number = 0;
  loadingCreation = false;

  constructor() {
    this.listenToFetchEventDetails();
    this.listenToFetchEventVideoContent();
  }

  ngOnInit(): void {
    this.fetchEventDetails(this.eventId);
    this.fetchEventVideoContent(this.eventId);
  }

  private fetchEventDetails(eventId: number) {
    this.loading = true;
    this.eventService.getEventById(eventId);
  }

  private fetchEventVideoContent(eventId: number) {
    this.videoLoading= true;
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



  // Tab management
  activeTab = signal<string>('details');

  ngOnDestroy(): void {
    this.eventService.resetGetEventById();
    this.cleanUpVideoResources();
    this.eventService.resetGetEventContent();
  }




}
