import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Artist, CardArtist, CreatedArtist, NewArtist} from "./model/artist.model";
import {State} from "../shared/model/state.model";
import {environment} from "../../environments/environment";
import {createPaginationOption, Page, Pagination} from "../shared/model/request.model";

@Injectable({
  providedIn: 'root'
})
export class ArtistService {

  http = inject(HttpClient);

  private create$: WritableSignal<State<CreatedArtist>> = signal(State.Builder<CreatedArtist>().forInit());
  createSig = computed(() => this.create$());

  private getAllArtist$: WritableSignal<State<Page<CardArtist>>>
    = signal(State.Builder<Page<CardArtist>>().forInit());
  getAllArtistSig = computed(() => this.getAllArtist$());

  private getArtistById$: WritableSignal<State<Artist>> = signal(State.Builder<Artist>().forInit());
  getArtistByIdSig = computed(()=> this.getArtistById$());

  private existsById$: WritableSignal<State<boolean>> = signal(State.Builder<boolean>().forInit());
  existsByIdSig = computed(() => this.existsById$());

  private deleteArtist$: WritableSignal<State<void>> = signal(State.Builder<void>().forInit());
  deleteArtistSig = computed(() => this.deleteArtist$());

  private updateArtist$: WritableSignal<State<void>> = signal(State.Builder<void>().forInit());
  updateArtistSig = computed(() => this.updateArtist$());


  create(newArtist: NewArtist): void {
    const formData = new FormData();
    for(let i = 0; i < newArtist.pictures.length; ++i) {
      formData.append("picture-" + i, newArtist.pictures[i].file);
    }
    const clone = structuredClone(newArtist);
    clone.pictures = [];
    formData.append("artistRequest", JSON.stringify(clone));
    this.http.post<CreatedArtist>(`${environment.API_URL}/artists/create`,
      formData).subscribe({
      next: artist => this.create$.set(State.Builder<CreatedArtist>().forSuccess(artist)),
      error: err => this.create$.set(State.Builder<CreatedArtist>().forError(err)),
    });
  }

  resetArtistCreation(): void {
    this.create$.set(State.Builder<CreatedArtist>().forInit())
  }

  getAll(pageRequest: Pagination): void {
    let params = createPaginationOption(pageRequest);
    const url = `${environment.API_URL}/artists/get-all`;
    this.http.get<Page<CardArtist>>(url, { params })
      .subscribe({
        next: (artists) => this.getAllArtist$.set(State.Builder<Page<CardArtist>>().forSuccess(artists)),
        error: (error) => {
          this.getAllArtist$.set(State.Builder<Page<CardArtist>>().forError(error));
        }
      });
  }

  resetGetAllArtist(): void {
    this.getAllArtist$.set(State.Builder<Page<CardArtist>>().forInit())
  }

  getArtistById(artistId: number): void {
    this.http.get<Artist>(`${environment.API_URL}/artists/get-one/${artistId}`)
      .subscribe({
        next: artist => this.getArtistById$.set(State.Builder<Artist>().forSuccess(artist)),
        error: err => this.getArtistById$.set(State.Builder<Artist>().forError(err)),
      });
  }

  resetGetOneById(): void {
    this.getArtistById$.set(State.Builder<Artist>().forInit())
  }

  existsById(artistId: number): void {
    this.http.get<boolean>(`${environment.API_URL}/artists/exists/${artistId}`)
      .subscribe({
        next: exists => this.existsById$.set(State.Builder<boolean>().forSuccess(exists)),
        error: err => this.existsById$.set(State.Builder<boolean>().forError(err)),
      });
  }

  resetExistsById(): void {
    this.existsById$.set(State.Builder<boolean>().forInit())
  }

  deleteArtist(artistId: number): void {
    this.http.delete<void>(`${environment.API_URL}/artists/${artistId}`)
      .subscribe({
        next: () => this.deleteArtist$.set(State.Builder<void>().forSuccess()),
        error: err => this.deleteArtist$.set(State.Builder<void>().forError(err)),
      });
  }

  resetDeleteArtist(): void {
    this.deleteArtist$.set(State.Builder<void>().forInit())
  }

  updateArtist(artistId: number, updatedArtist: NewArtist): void {
    const formData = new FormData();
    for (let i = 0; i < updatedArtist.pictures.length; ++i) {
      formData.append("picture-" + i, updatedArtist.pictures[i].file);
    }
    const clone = structuredClone(updatedArtist);
    clone.pictures = [];
    formData.append("artistRequest", JSON.stringify(clone));
    this.http.put<void>(`${environment.API_URL}/artists/${artistId}`, formData)
      .subscribe({
        next: () => this.updateArtist$.set(State.Builder<void>().forSuccess()),
        error: err => this.updateArtist$.set(State.Builder<void>().forError(err)),
      });
  }

  resetUpdateArtist(): void {
    this.updateArtist$.set(State.Builder<void>().forInit())
  }




  constructor() { }
}
