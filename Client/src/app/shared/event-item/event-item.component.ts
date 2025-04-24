import {Component, effect, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {ToastService} from "../../service/toast.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {EventService} from "../../service/event.service";
import {map} from "rxjs";
import {DisplayPicture} from "../../service/model/artist.model";
import {Event} from "../../service/model/event.model";
import {GalleriaModule} from "primeng/galleria";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ButtonDirective} from "primeng/button";
import {NgFor, NgIf} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {ImageModule} from "primeng/image";

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
    RouterLink
  ],
  templateUrl: './event-item.component.html',
  styleUrl: './event-item.component.scss'
})
export class EventItemComponent implements OnInit, OnDestroy  {
  toastService = inject(ToastService);
  activatedRoute = inject(ActivatedRoute);
  eventService = inject(EventService);

  event: Event | undefined;
  coverPicture?: DisplayPicture;

  currentEventId!: number;
  loading = true;
  activeIndex: number = 0;


  constructor() {
    this.listenToFetchEventDetails();
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


  private listenToFetchEventDetails() {
    effect(() => {
      const eventByIdState = this.eventService.getEventByIdSig();
      if (eventByIdState.status === "OK") {
        this.loading = false;
        this.event = eventByIdState.value;
        if (this.event) {
          this.event.pictures = this.putCoverPictureFirst(this.event.pictures);
          this.coverPicture = this.event.pictures.length > 0 ? this.event.pictures[0] : undefined;
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


  ngOnDestroy(): void {
    this.eventService.resetGetEventById();
  }


}
