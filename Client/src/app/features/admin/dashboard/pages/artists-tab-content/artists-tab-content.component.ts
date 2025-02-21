import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {NgForOf} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddArtistComponent} from "../add-artist/add-artist.component";
import {ToastService} from "../../../../../service/toast.service";
import {ArtistService} from "../../../../../service/artist.service";
import {CardArtist} from "../../../../../service/model/artist.model";
import {Pagination} from "../../../../../shared/model/request.model";


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


  loadingFetchAll = false;

  pageRequest: Pagination = {size: 20, page: 0, sort: ["name", "ASC"]};
  fullArtistList: Array<CardArtist> = [];
  artists: Array<CardArtist> | undefined = [];


  private modalService = inject(NgbModal);

  constructor() {
    this.listenFetchAll();
  }


  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.fetchArtists();
  }

  // Mock song data
  mockSongs = [
    {
      _id: '1',
      title: 'Song One',
      artist: 'Artist One',
      imageUrl: 'https://via.placeholder.com/50',
      createdAt: '2025-02-15T00:00:00Z',
    },
    {
      _id: '2',
      title: 'Song Two',
      artist: 'Artist Two',
      imageUrl: 'https://via.placeholder.com/50',
      createdAt: '2025-02-16T00:00:00Z',
    },
    {
      _id: '3',
      title: 'Song Three',
      artist: 'Artist Three',
      imageUrl: 'https://via.placeholder.com/50',
      createdAt: '2025-02-17T00:00:00Z',
    },
  ];

  // Mock delete method (just logs the song to the console for now)
  deleteSong(song: any) {
    console.log(`Song to delete: ${song.title}`);
    // Here you can add logic to delete the song from the list, like:
    // this.mockSongs = this.mockSongs.filter(s => s._id !== song._id);
  }

  openAddArtistModal() {
    const modalRef = this.modalService.open(AddArtistComponent, {
      centered: true,
      size: 'lg'
    });

    // You can also pass data to the modal if needed:
    // modalRef.componentInstance.someInput = 'value';
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
