import {Component, inject, OnInit} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {TabService} from "../../../../../service/tab.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {filter, Subject, takeUntil} from "rxjs";
import {AddSongComponent} from "../../../../song/add-song/add-song.component";
import {NewEventComponent} from "../../../../events/new-event/new-event.component";

@Component({
  selector: 'app-events-tab-content',
  standalone: true,
    imports: [
        FaIconComponent
    ],
  templateUrl: './events-tab-content.component.html',
  styleUrl: './events-tab-content.component.scss'
})
export class EventsTabContentComponent implements OnInit {

  tabService = inject(TabService);
  private modalService = inject(NgbModal);
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.tabService.activeTab$.pipe(
      filter(tab => tab === 'events'), // Only react to 'events' tab
      takeUntil(this.destroy$)
    ).subscribe(() => {
      //this.fetchSongs();
    });
  }

  openAddEventModal() {
    const modalRef = this.modalService.open(NewEventComponent, {
      centered: true,
      size: 'xl'
    });
  }

}
