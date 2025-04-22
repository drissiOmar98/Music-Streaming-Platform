import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {TabService} from "../../../../../service/tab.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {filter, Subject, takeUntil} from "rxjs";
import {NewEventComponent} from "../../../../events/new-event/new-event.component";
import {ToastService} from "../../../../../service/toast.service";
import {EventService} from "../../../../../service/event.service";
import {Pagination} from "../../../../../shared/model/request.model";
import {CardEvent} from "../../../../../service/model/event.model";
import {CalendarOptions, EventClickArg, EventInput} from "@fullcalendar/core";
import {FullCalendarModule} from "@fullcalendar/angular";
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import {NgForOf, NgIf} from "@angular/common";
import {CardArtist, DisplayPicture} from "../../../../../service/model/artist.model";
import {EventDetailsModalComponent} from "../event-details-modal/event-details-modal.component";

@Component({
  selector: 'app-events-tab-content',
  standalone: true,
  imports: [
    FaIconComponent,
    FullCalendarModule,
    NgIf,
    EventDetailsModalComponent,
    NgForOf,
  ],
  templateUrl: './events-tab-content.component.html',
  styleUrl: './events-tab-content.component.scss'
})
export class EventsTabContentComponent implements OnInit ,OnDestroy{



  toastService = inject(ToastService);
  eventService = inject (EventService);
  tabService = inject(TabService);
  private modalService = inject(NgbModal);


  pageRequest: Pagination = {size: 20, page: 0, sort: ["title", "ASC"]};
  private destroy$ = new Subject<void>();

  fullEventList: Array<CardEvent> = [];
  events: Array<CardEvent> | undefined = [];
  loadingFetchAll = false;
  calendarEvents: EventInput[] = [];

  // Calendar properties
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    weekends: true,
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    eventClick: this.handleEventClick.bind(this),
    events: [],
    eventColor: '#1DB954',
    eventTextColor: '#ffffff',
    eventDisplay: 'block',
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false
    },
    eventContent: this.customEventContent.bind(this),
    views: {
      timeGridWeek: {
        dayHeaderFormat: { weekday: 'short', day: 'numeric' }
      },
      dayGridMonth: {
        titleFormat: { year: 'numeric', month: 'long' }
      }
    }
  };

  selectedEvent: CardEvent | null = null;


  constructor() {
    this.listenFetchAll();
  }

  ngOnInit(): void {
    this.tabService.activeTab$.pipe(
      filter(tab => tab === 'events'), // Only react to 'events' tab
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.fetchEvents();
    });
  }

  openAddEventModal() {
    const modalRef = this.modalService.open(NewEventComponent, {
      centered: true,
      size: 'xl'
    });
  }


  private fetchEvents() {
    this.loadingFetchAll = true;
    this.eventService.getAll(this.pageRequest);
  }

  private listenFetchAll() {
    effect(() => {
      const allEventState = this.eventService.getAllEventSig();
      if (allEventState.status === "OK" && allEventState.value) {
        this.loadingFetchAll = false;
        this.fullEventList = allEventState.value?.content || [];
        this.prepareCalendarEvents();
      } else if (allEventState.status === "ERROR") {
        this.toastService.show("Error when fetching the events.", "DANGER");
      }
    });
  }

  private prepareCalendarEvents() {
    this.calendarOptions.events = this.fullEventList.map(event => ({
      id: event.id.toString(),
      title: event.title,
      start: event.startDateTime,
      end: event.endDateTime,
      extendedProps: {
        location: event.location,
        artists: event.artists,
        cover: event.cover
      },
      backgroundColor: this.getEventColor(event),
      borderColor: this.getEventColor(event),
      classNames: ['event-item']
    }));
  }

  customEventContent(arg: any) {
    const event = arg.event;
    const viewType = arg.view.type;
    const artists = event.extendedProps.artists || [];

    if (viewType === 'dayGridMonth') {
      // Month view - compact display
      return {
        html: `
        <div class="fc-event-content">
          <div class="fc-event-title">${event.title}</div>
          <div class="fc-event-artist-count">${artists.length} artist${artists.length !== 1 ? 's' : ''}</div>
        </div>
      `
      };
    } else {
      // Week/Day/List views - detailed display
      const maxVisibleArtists = 3;
      const visibleArtists = artists.slice(0, maxVisibleArtists);
      const extraCount = Math.max(0, artists.length - maxVisibleArtists);

      const artistCovers = visibleArtists.map((artist: CardArtist) => {
        if (artist.cover?.file) {
          return `
          <div class="artist-cover-container">
            <div class="artist-cover-image"
                 style="background-image: url('data:${artist.cover.fileContentType};base64,${artist.cover.file}')"></div>
          </div>
        `;
        }
        return '';
      }).join('');

      const extraIndicator = extraCount > 0
        ? `<div class="extra-artists-indicator">+${extraCount}</div>`
        : '';

      return {
        html: `
        <div class="fc-event-content">
          <div class="fc-event-title">${event.title}</div>
          <div class="fc-event-artists-covers">
            ${artistCovers}
            ${extraIndicator}
          </div>
          ${event.extendedProps.cover?.file ?
          `<div class="fc-event-cover"
                 style="background-image: url('data:${event.extendedProps.cover.fileContentType};base64,${event.extendedProps.cover.file}')"></div>` : ''}
        </div>
      `
      };
    }
  }



  private getEventColor(event: CardEvent): string {
    const now = new Date();
    const start = new Date(event.startDateTime);
    const end = new Date(event.endDateTime);

    if (end < now) return '#535353'; // Past events - gray
    if (start <= now && end >= now) return '#1DB954'; // Ongoing - Spotify green
    return '#1E88E5'; // Upcoming - blue
  }

  // In your parent component (events-tab-content.component.ts)
  handleEventClick(clickInfo: EventClickArg) {
    const eventId = clickInfo.event.id;
    const foundEvent = this.fullEventList.find(e => e.id.toString() === eventId);

    if (foundEvent) {
      const modalRef = this.modalService.open(EventDetailsModalComponent, {
        size: 'lg',
        centered: true,
        windowClass: 'spotify-modal',
        backdrop: 'static'
      });

      // Set the input signal value
      modalRef.componentInstance.event.set(foundEvent);

      // Handle modal result if needed
      modalRef.result.then(
        (result) => {
          console.log('Modal closed', result);
        },
        (reason) => {
          console.log('Modal dismissed', reason);
        }
      );
    }
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.eventService.resetGetAllEvent();
  }

}
