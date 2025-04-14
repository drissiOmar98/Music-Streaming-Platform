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

  //selectedArtist = input.required<Number>();
  // Input can be either a single ID or array of IDs
  selectedArtist = input.required<number | number[]>();

  // New input to determine selection mode
  selectionMode = input<'single' | 'multiple'>('single');

  @Output() artistSelected = new EventEmitter<number>();

  @Output() artistsSelected = new EventEmitter<number[]>();

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


  onSelectArtist(artistId: number) {
    if (this.selectionMode() === 'single') {
      // Single selection mode
      this.artistSelected.emit(artistId);
      this.stepValidityChange.emit(true);
    } else {
      // Multiple selection mode
      const currentSelection = this.getCurrentSelectionArray();

      let newSelection: number[];

      if (currentSelection.includes(artistId)) {
        // Remove artist if already selected
        newSelection = currentSelection.filter(id => id !== artistId);
      } else {
        // Add artist if not selected
        newSelection = [...currentSelection, artistId];
      }

      this.artistsSelected.emit(newSelection);
      this.stepValidityChange.emit(newSelection.length > 0);
    }
  }

  isArtistSelected(artistId: number): boolean {
    if (this.selectionMode() === 'single') {
      return this.selectedArtist() === artistId;
    } else {
      return this.getCurrentSelectionArray().includes(artistId);
    }
  }

  // Helper method to always get an array of selected artist IDs
  private getCurrentSelectionArray(): number[] {
    const selection = this.selectedArtist();
    return Array.isArray(selection) ? selection : (selection !== undefined ? [selection] : []);
  }


  onSearch(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.artists = this.fullArtistList.filter(artist =>
      artist.name.toLowerCase().includes(searchTerm)
    );
  }


  protected readonly faSearch = faSearch;
  protected readonly Array = Array;
}
