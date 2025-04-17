import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {State} from "../shared/model/state.model";
import {environment} from "../../environments/environment";
import {Follow, FollowRequest} from "./model/follow.model";

@Injectable({
  providedIn: 'root'
})
export class FollowService {

  http = inject(HttpClient);

  private getFollowedArtists$: WritableSignal<State<Array<Follow>>> = signal(State.Builder<Array<Follow>>().forInit());
  getFollowedArtistsSig = computed(() => this.getFollowedArtists$());

  private followArtist$: WritableSignal<State<void>> = signal(State.Builder<void>().forInit());
  followArtistSig = computed(() => this.followArtist$());

  private unfollowArtist$: WritableSignal<State<void>> = signal(State.Builder<void>().forInit());
  unfollowArtistSig = computed(() => this.unfollowArtist$());

  private clearFollowers$: WritableSignal<State<void>> = signal(State.Builder<void>().forInit());
  clearFollowersSig = computed(() => this.clearFollowers$());

  private followersCount$: WritableSignal<number> = signal(0);
  followersCountSig = computed(() => this.followersCount$());

  private isArtistInFollowedMap$: Map<number, WritableSignal<State<boolean>>> = new Map();

  getIsArtistInFollowingListSignal(artistId: number): WritableSignal<State<boolean>> {
    if (!this.isArtistInFollowedMap$.has(artistId)) {
      this.isArtistInFollowedMap$.set(artistId, signal(State.Builder<boolean>().forInit()));
    }
    return this.isArtistInFollowedMap$.get(artistId)!;
  }


  checkArtistInFollowedList(artistId: number): void {
    const artistStateSignal = this.getIsArtistInFollowingListSignal(artistId);
    console.log("Checking artist in followedList:", artistId);
    this.http
      .get<boolean>(`${environment.API_URL}/follows/is-following/${artistId}`)
      .subscribe({
        next: (isFollowed) => {
          console.log("Backend response:", isFollowed);
          artistStateSignal.set(State.Builder<boolean>().forSuccess(isFollowed));
        },
        error: (err) => {
          artistStateSignal.set(State.Builder<boolean>().forError(err));
        },
      });
  }


  updateFollowersCount(): void {
    const state = this.getFollowedArtists$();
    if (state.status === 'OK' && state.value) {
      this. followersCount$.set(state.value.length);
    } else {
      this. followersCount$.set(0);
    }
  }

  followArtist(request: FollowRequest): void {
    this.http.post<void>(`${environment.API_URL}/follows`, request)
      .subscribe({
        next: () => {
          this.followArtist$.set(State.Builder<void>().forSuccess());
          this.getFollowedArtists();
          this.resetUnfollowArtistState();
        },
        error: (err) => {
          this.followArtist$.set(State.Builder<void>().forError(err));
        }
      });
  }

  getFollowedArtists(): void {
    this.http.get<Array<Follow>>(`${environment.API_URL}/follows`)
      .subscribe({
        next: followers => {
          this.getFollowedArtists$.set(State.Builder<Array<Follow>>().forSuccess(followers));
          this.updateFollowersCount();
        },
        error: err => this.getFollowedArtists$.set(State.Builder<Array<Follow>>().forError(err)),
      });
  }

  clearFollowers(): void {
    this.http.delete<void>(`${environment.API_URL}/follows/clear`)
      .subscribe({
        next: () => {
          this.clearFollowers$.set(State.Builder<void>().forSuccess());
          this.updateFollowersCount();
        },
        error: (err) => {
          this.clearFollowers$.set(State.Builder<void>().forError(err));
        }
      });
  }

  unfollowArtist(songId: number): void {
    this.http.delete<void>(`${environment.API_URL}/follows/${songId}`)
      .subscribe({
        next: () => {
          this.unfollowArtist$.set(State.Builder<void>().forSuccess());
          this.getFollowedArtists();
          this.updateFollowersCount();
        },
        error: (err) => {
          this.unfollowArtist$.set(State.Builder<void>().forError(err));
        }
      });
  }

  resetGetFollowedArtistsState(): void {
    this.getFollowedArtists$.set(State.Builder<Array<Follow>>().forInit());
  }


  resetFollowArtistState(): void {
    this.followArtist$.set(State.Builder<void>().forInit());
  }


  resetUnfollowArtistState(): void {
    this.unfollowArtist$.set(State.Builder<void>().forInit());
  }


  resetClearFollowersState(): void {
    this.clearFollowers$.set(State.Builder<void>().forInit());
  }

  resetAllIsArtistInFollowedStates(): void {
    this.isArtistInFollowedMap$.forEach(signal => {
      signal.set(State.Builder<boolean>().forInit());
    });
  }

  constructor() {
    this.getFollowedArtists();
  }

}
