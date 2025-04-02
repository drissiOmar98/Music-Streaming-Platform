import {Component, effect, inject} from '@angular/core';
import {Router} from "@angular/router";
import {ToastService} from "../../../service/toast.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {CreatedEvent, DateRange, EventVideo, NewEvent, NewEventInfo} from "../../../service/model/event.model";
import {Step} from "../../admin/dashboard/pages/add-artist/step.model";
import {State} from "../../../shared/model/state.model";
import {EventService} from "../../../service/event.service";

import {NewEventPicture} from "../../../service/model/picture.model";
import {ArtistStepComponent} from "../../song/add-song/steps/artist-step/artist-step.component";
import {DetailsStepComponent} from "../../song/add-song/steps/details-step/details-step.component";
import {FooterStepComponent} from "../../admin/dashboard/pages/add-artist/footer-step/footer-step.component";
import {GenreStepComponent} from "../../song/add-song/steps/genre-step/genre-step.component";
import {EventInfoStepComponent} from "./steps/event-info-step/event-info-step.component";

import {
  PicturesStepComponent
} from "../../admin/dashboard/pages/add-artist/steps/pictures-step/pictures-step.component";
import {VideoStepComponent} from "./steps/video-step/video-step.component";
import {LocationStepComponent} from "./steps/location-step/location-step.component";
import {DateRangeStepComponent} from "./steps/date-range-step/date-range-step.component";

@Component({
  selector: 'app-new-event',
  standalone: true,
  imports: [
    ArtistStepComponent,
    DetailsStepComponent,
    FooterStepComponent,
    GenreStepComponent,
    EventInfoStepComponent,
    PicturesStepComponent,
    VideoStepComponent,
    LocationStepComponent,
    DateRangeStepComponent
  ],
  templateUrl: './new-event.component.html',
  styleUrl: './new-event.component.scss'
})
export class NewEventComponent {

  private router = inject(Router);
  private toastService = inject(ToastService);
  private activeModal=inject(NgbActiveModal);
  eventService = inject(EventService);


  INFO = "info";
  PHOTOS = "photos";
  ARTISTS = "artists";
  VIDEOS = "videos";
  LOCATION = "location";
  DATES= "dates";

  steps: Step[] = [
    {
      id: this.INFO,
      idNext: this.PHOTOS,
      idPrevious: null,
      isValid: false
    },
    {
      id: this.PHOTOS,
      idNext: this.ARTISTS,
      idPrevious: this.INFO,
      isValid: false
    },
    {
      id: this.ARTISTS,
      idNext: this.VIDEOS,
      idPrevious: this.PHOTOS,
      isValid: false
    },
    {
      id: this.VIDEOS,
      idNext: this.LOCATION,
      idPrevious: this.ARTISTS,
      isValid: false
    },
    {
      id: this.LOCATION,
      idNext: this.DATES,
      idPrevious: this.VIDEOS,
      isValid: false
    },
    {
      id: this.DATES,
      idNext: null,
      idPrevious: this.LOCATION,
      isValid: false
    }
  ];

  currentStep = this.steps[0];
  loadingCreation = false;

  newEvent: NewEvent = this.initializeNewEvent();

  private initializeNewEvent(): NewEvent {
    const nextFriday = new Date();
    nextFriday.setDate(nextFriday.getDate() + (5 + 7 - nextFriday.getDay()) % 7);
    nextFriday.setHours(20, 0, 0, 0); // 8:00 PM

    // Default duration of 3 hours (typical concert length)
    const endTime = new Date(nextFriday);
    endTime.setHours(nextFriday.getHours() + 3);

    return {
      infos: {
        title: "",
        description: "",
      },
      location:"",
      dateRange: {
        startDateTime: nextFriday,
        endDateTime: endTime
      },
      video: {
        file: undefined,
        fileContentType: undefined,
        videoUrl: ""
      },
      pictures: new Array<NewEventPicture>(),
      artistIds: []
    };
  }


  constructor() {
    this.trackEventCreationStatus();
    this.listenEventCreation();
  }

  trackEventCreationStatus() {
    // Start a reactive effect to monitor changes in the creation status signal.
    effect(() => {
      if (this.eventService.createSig().status === "OK") {
        this.router.navigate(["/dashboard"]);
      }
    });
  }

  listenEventCreation() {
    effect(() => {
      let createdEventState = this.eventService.createSig();
      if (createdEventState.status === "OK") {
        this.onCreateOk(createdEventState);
      } else if (createdEventState.status === "ERROR") {
        this.onCreateError();
      }
    });
  }

  createEvent() {
    this.loadingCreation = true;
    this.eventService.createEvent(this.newEvent);
  }





  nextStep(): void {
    if (this.currentStep.idNext !== null) {
      this.currentStep = this.steps.filter((step: Step) => step.id === this.currentStep.idNext)[0];
    }
  }

  previousStep(): void {
    if (this.currentStep.idPrevious !== null) {
      this.currentStep = this.steps.filter((step: Step) => step.id === this.currentStep.idPrevious)[0];
    }
  }

  isAllStepsValid(): boolean {
    return this.steps.filter(step => step.isValid).length === this.steps.length;
  }

  onValidityChange(validity: boolean) {
    this.currentStep.isValid = validity;
  }

  onInfoChange(newInfo: NewEventInfo) {
    this.newEvent.infos = newInfo;
  }
  onPictureChange(newPictures: NewEventPicture[]) {
    this.newEvent.pictures = newPictures;
  }
  onLocationChange(newLocation: string) {
    this.newEvent.location = newLocation;
  }
  onArtistsSelected(artistIds: number[]) {
    this.newEvent.artistIds = artistIds
  }
  onVideoChange(newVideo: EventVideo) {
    this.newEvent.video = newVideo;
  }
  onDatesChange(newDates : DateRange){
    this.newEvent.dateRange= newDates;
  }



  onCreateOk(createdEventState: State<CreatedEvent>) {
    this.loadingCreation = false;
    this.toastService.show("Event created successfully.", "SUCCESS");
    this.closeModal()
  }

  private onCreateError() {
    this.loadingCreation = false;
    this.toastService.show("Couldn't create your Event, please try again.", "DANGER");
  }

  closeModal() {
    this.activeModal.dismiss();
  }



}
