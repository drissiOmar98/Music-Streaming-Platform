import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {NgForOf} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddArtistComponent} from "../add-artist/add-artist.component";
import {ToastService} from "../../../../../service/toast.service";
import {ArtistService} from "../../../../../service/artist.service";
import {CardArtist} from "../../../../../service/model/artist.model";
import {Pagination} from "../../../../../shared/model/request.model";
import {TabService} from "../../../../../service/tab.service";
import {filter, Subject, takeUntil} from "rxjs";


@Component({
  selector: 'app-artists-tab-content',
  standalone: true,
    imports: [
        FontAwesomeModule,
        NgForOf
    ],
  templateUrl: './artists-tab-content.component.html',
  styleUrl: './artists-tab-content.component.scss'
})
export class ArtistsTabContentComponent implements OnInit , OnDestroy{

  toastService = inject(ToastService);
  artistService = inject (ArtistService);
  tabService = inject(TabService);
  private destroy$ = new Subject<void>();



  loadingFetchAll = false;

  pageRequest: Pagination = {size: 20, page: 0, sort: ["name", "ASC"]};
  fullArtistList: Array<CardArtist> = [];
  artists: Array<CardArtist> | undefined = [];


  private modalService = inject(NgbModal);

  constructor() {
    this.listenFetchAll();
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.artistService.resetGetAllArtist();
  }

  ngOnInit(): void {
    this.tabService.activeTab$.pipe(
      filter(tab => tab === 'artists'), // Only react to 'artists' tab
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.fetchArtists();
    });
  }




  deleteSong(song: any) {
    console.log(`Song to delete: ${song.title}`);

  }

  openAddArtistModal() {
    const modalRef = this.modalService.open(AddArtistComponent, {
      centered: true,
      size: 'lg'
    });

  }

  private fetchArtists() {
    this.loadingFetchAll = true;
    this.artistService.getAll(this.pageRequest);
  }

  private listenFetchAll() {
    effect(() => {
      const allArtistState = this.artistService. getAllArtistSig();
      if (allArtistState.status === "OK" && allArtistState.value) {
        this.loadingFetchAll = false;
        this.fullArtistList = allArtistState.value?.content || [];
        this.artists = [...this.fullArtistList];
      } else if (allArtistState.status === "ERROR") {
        this.toastService.show("Error when fetching the artists.", "DANGER");
      }
    });
  }


  deleteArtist(artist: CardArtist) {

  }
}
