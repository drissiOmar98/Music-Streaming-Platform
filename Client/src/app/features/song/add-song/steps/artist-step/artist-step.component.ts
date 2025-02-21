import {Component, effect, EventEmitter, inject, input, OnDestroy, OnInit, Output} from '@angular/core';
import {ToastService} from "../../../../../service/toast.service";
import {Pagination} from "../../../../../shared/model/request.model";
import {CardArtist} from "../../../../../service/model/artist.model";
import {ArtistService} from "../../../../../service/artist.service";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-artist-step',
  standalone: true,
  imports: [
    FaIconComponent
  ],
  templateUrl: './artist-step.component.html',
  styleUrl: './artist-step.component.scss'
})
export class ArtistStepComponent  implements OnInit, OnDestroy {

  toastService = inject(ToastService);
  artistService = inject (ArtistService);

  selectedArtist = input.required<Number>();

  @Output() artistSelected = new EventEmitter<number>();

  @Output()
  stepValidityChange = new EventEmitter<boolean>();

  loadingFetchAll = false;

  pageRequest: Pagination = {size: 20, page: 0, sort: ["name", "ASC"]};
  fullArtistList: Array<CardArtist> = [];
  artists: Array<CardArtist> | undefined = [];

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.fetchArtists();
  }


  constructor() {
    this.listenFetchAll();
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

  onSelectArtist(categoryId: number) {
    this.artistSelected.emit(categoryId);
    this.stepValidityChange.emit(true);
  }

  onSearch(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.artists = this.fullArtistList.filter(artist =>
      artist.name.toLowerCase().includes(searchTerm)
    );
  }


  protected readonly faSearch = faSearch;
}
