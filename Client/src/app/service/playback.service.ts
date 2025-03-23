import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PlaybackService {

  private isPlayingSubject = new BehaviorSubject<{ artistId?: number, isPlaying: boolean }>({ isPlaying: false });
  isPlaying$ = this.isPlayingSubject.asObservable();

  setPlayingState(artistId: number | undefined, isPlaying: boolean): void {
    this.isPlayingSubject.next({ artistId, isPlaying });
  }

  getCurrentState(): { artistId?: number, isPlaying: boolean } {
    return this.isPlayingSubject.value;
  }
}
