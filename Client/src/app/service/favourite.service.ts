import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {State} from "../shared/model/state.model";
import {Favourite, favouriteRequest} from "./model/favourite.model";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FavouriteService {

  http = inject(HttpClient);

  private getWishList$: WritableSignal<State<Array<Favourite>>> = signal(State.Builder<Array<Favourite>>().forInit());
  getWishListSig = computed(() => this.getWishList$());

  private addToFavourites$: WritableSignal<State<void>> = signal(State.Builder<void>().forInit());
  addToFavouritesSig = computed(() => this.addToFavourites$());

  private removeFromFavourites$: WritableSignal<State<void>> = signal(State.Builder<void>().forInit());
  removeFromFavouritesSig = computed(() => this.removeFromFavourites$());

  private clearFavourites$: WritableSignal<State<void>> = signal(State.Builder<void>().forInit());
  clearFavouritesStateSig = computed(() => this.clearFavourites$());


  private wishListCount$: WritableSignal<number> = signal(0);
  wishListCountSig = computed(() => this.wishListCount$());

  private isSongInFavouriteMap$: Map<number, WritableSignal<State<boolean>>> = new Map();

  getIsSongInWishListSignal(songId: number): WritableSignal<State<boolean>> {
    if (!this.isSongInFavouriteMap$.has(songId)) {
      this.isSongInFavouriteMap$.set(songId, signal(State.Builder<boolean>().forInit()));
    }
    return this.isSongInFavouriteMap$.get(songId)!;
  }


  checkSongInWishList(songId: number): void {
    const songStateSignal = this.getIsSongInWishListSignal(songId);
    console.log("Checking song in wishList for songId:", songId);

    this.http
      .get<boolean>(`${environment.API_URL}/favourites/is-favourite/${songId}`)
      .subscribe({
        next: (isFavourite) => {
          console.log("Backend response:", isFavourite);
          songStateSignal.set(State.Builder<boolean>().forSuccess(isFavourite));
        },
        error: (err) => {
          console.error(`Error checking songId ${songId} in wishList:`, err);
          songStateSignal.set(State.Builder<boolean>().forError(err));
        },
      });
  }


  updateWishlistCount(): void {
    const state = this.getWishList$(); // Get the signal value
    if (state.status === 'OK' && state.value) {
      console.log("Wishlist count being set:", state.value.length);
      this.wishListCount$.set(state.value.length);
    } else {
      console.log("Defaulting wishlist count to 0");
      this.wishListCount$.set(0);
    }
  }

  addToFavourites(favRequest: favouriteRequest): void {
    this.http.post<void>(`${environment.API_URL}/favourites`, favRequest)
      .subscribe({
        next: () => {
          this.addToFavourites$.set(State.Builder<void>().forSuccess());  // Update success state
          this.getMyWishList();  // Refresh the wishlist
          this.resetRemoveFromFavouritesState();
        },
        error: (err) => {
          this.addToFavourites$.set(State.Builder<void>().forError(err));  // Set error in state
        }
      });
  }

  getMyWishList(): void {
    this.http.get<Array<Favourite>>(`${environment.API_URL}/favourites`)
      .subscribe({
        next: favourites => {
          this.getWishList$.set(State.Builder<Array<Favourite>>().forSuccess(favourites));
          this.updateWishlistCount(); // Update count
        },
        error: err => this.getWishList$.set(State.Builder<Array<Favourite>>().forError(err)),
      });
  }

  clearFavourites(): void {
    this.http.delete<void>(`${environment.API_URL}/favourites/clear`)
      .subscribe({
        next: () => {
          this.clearFavourites$.set(State.Builder<void>().forSuccess());
          this.updateWishlistCount();
        },
        error: (err) => {
          this.clearFavourites$.set(State.Builder<void>().forError(err));
        }
      });
  }

  removeFromFavourites(songId: number): void {
    this.http.delete<void>(`${environment.API_URL}/favourites/${songId}`)
      .subscribe({
        next: () => {
          this.removeFromFavourites$.set(State.Builder<void>().forSuccess());  // Set success state
          this.getMyWishList();  // Refresh the wishlist
          // this.resetAddToFavouritesState();
          this.updateWishlistCount();
        },
        error: (err) => {
          this.removeFromFavourites$.set(State.Builder<void>().forError(err));  // Set error in state
        }
      });
  }


  // Reset state for the wish list
  resetGetWishListState(): void {
    this.getWishList$.set(State.Builder<Array<Favourite>>().forInit());
  }

  // Reset state for adding to favourites
  resetAddToFavouritesState(): void {
    this.addToFavourites$.set(State.Builder<void>().forInit());
  }

  // Reset state for removing from favourites
  resetRemoveFromFavouritesState(): void {
    this.removeFromFavourites$.set(State.Builder<void>().forInit());
  }

  // Reset state for clearing favourites
  resetClearFavouritesState(): void {
    this.clearFavourites$.set(State.Builder<void>().forInit());
  }

  resetAllIsSongInWishListStates(): void {
    this.isSongInFavouriteMap$.forEach(signal => {
      signal.set(State.Builder<boolean>().forInit());
    });
  }

  constructor() {
    this.getMyWishList();  // Automatically fetch the wishlist on service initialization
  }


}
