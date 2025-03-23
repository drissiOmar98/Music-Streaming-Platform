import {Component, effect, inject, OnDestroy} from '@angular/core';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {FormsModule} from "@angular/forms";
import {SmallSongCardComponent} from "../../shared/small-song-card/small-song-card.component";
import {ReadSong, SongContent} from "../../service/model/song.model";
import {SongContentService} from "../../service/song-content.service";
import {Howl} from "howler";
import {NgClass} from "@angular/common";
import {PlaybackService} from "../../service/playback.service";
import {FavoriteSongBtnComponent} from "../../shared/favorite-song-btn/favorite-song-btn.component";
import {favouriteRequest} from "../../service/model/favourite.model";
import {ToastService} from "../../service/toast.service";
import {FavouriteService} from "../../service/favourite.service";

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [FontAwesomeModule,
    FormsModule,
    SmallSongCardComponent, NgClass, FavoriteSongBtnComponent,],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent implements  OnDestroy  {

  songContentService = inject(SongContentService);
  playbackService = inject(PlaybackService);
  toastService = inject(ToastService);
  favouriteService = inject(FavouriteService);

  public currentSong: SongContent | undefined = undefined;
  currentHowlInstance: Howl | undefined;

  isPlaying: boolean = false;
  currentVolume = 0.5;
  isMuted = false;
  currentProgress = 0; // Track the current playback progress (0 to 100)
  private progressInterval: any; // Interval for updating the progress bar

  private nextQueue: Array<SongContent> = [];
  private previousQueue: Array<SongContent> = [];

  loadingCreation = false;

  constructor() {
    effect(() => {
      const newQueue = this.songContentService.queueToPlay();
      if (newQueue.length > 0) {
        this.onNewQueue(newQueue);
      }
    });

    effect(() => {
      if (this.songContentService.playNewSong().status === "OK") {
        this.onNextSong();
      }
    });

    this.playbackService.isPlaying$.subscribe(state => {
      this.isPlaying = state.isPlaying;
    });


  }

  private onNewQueue(newQueue: Array<ReadSong>): void {
    this.nextQueue = newQueue.map(song => ({
      ...song,
      songId: song.id,
    }));
    this.playNextSongInQueue();
  }

  private playNextSongInQueue(): void {
    if (this.nextQueue.length > 0) {
      this.isPlaying = false;
      if (this.currentSong) {
        this.previousQueue.unshift(this.currentSong);
      }
      const nextSong = this.nextQueue.shift();
      this.songContentService.fetchNextSong(nextSong!);
    }
  }

  private onNextSong(): void {
    this.currentSong = this.songContentService.playNewSong().value!;
    const newHowlInstance = new Howl({
      src: [`data:${this.currentSong.fileContentType};base64,${this.currentSong.file}`],
      volume: this.currentVolume,
      onplay: () => this.onPlay(),
      onpause: () => this.onPause(),
      onend: () => this.onEnd()
    });

    if (this.currentHowlInstance) {
      this.currentHowlInstance.stop();
    }

    newHowlInstance.play();
    this.currentHowlInstance = newHowlInstance;

    // Start updating the progress bar
    this.startProgressTracking();
  }

  private startProgressTracking(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
    this.progressInterval = setInterval(() => {
      if (this.currentHowlInstance) {
        const currentTime = this.currentHowlInstance.seek(); // Current time in seconds
        const duration = this.currentHowlInstance.duration(); // Total duration in seconds
        this.currentProgress = (currentTime / duration) * 100; // Convert to percentage
      }
    }, 1000); // Update every second
  }

  private onPlay(): void {
    this.isPlaying = true;
    this.playbackService.setPlayingState(this.currentSong?.artistId, true);
    this.startProgressTracking();
  }

  private onPause(): void {
    this.isPlaying = false;
    this.playbackService.setPlayingState(this.currentSong?.artistId, false);
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }

  private onEnd(): void {
    this.playNextSongInQueue();
    this.isPlaying = false;
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }

  onForward(): void {
    this.playNextSongInQueue();
  }

  onBackward(): void {
    if (this.previousQueue.length > 0) {
      this.isPlaying = false;
      if (this.currentSong) {
        this.nextQueue.unshift(this.currentSong!);
      }
      const previousSong = this.previousQueue.shift();
      this.songContentService.fetchNextSong(previousSong!);
    }
  }

  pause(): void {
    if (this.currentHowlInstance) {
      this.currentHowlInstance.pause();
    }
  }

  play(): void {
    if (this.currentHowlInstance) {
      this.currentHowlInstance.play();
    }
  }

  onMute(): void {
    if (this.currentHowlInstance) {
      this.isMuted = !this.isMuted;
      this.currentHowlInstance.mute(this.isMuted);
      if (this.isMuted) {
        this.currentVolume = 0;
      } else {
        this.currentVolume = 0.5;
        this.currentHowlInstance.volume(this.currentVolume);
      }
    }
  }

  onVolumeChange(newVolume: number): void {
    this.currentVolume = newVolume / 100;
    if (this.currentHowlInstance) {
      this.currentHowlInstance.volume(this.currentVolume);
      if (this.currentVolume === 0) {
        this.isMuted = true;
        this.currentHowlInstance.mute(this.isMuted);
      } else if (this.isMuted) {
        this.isMuted = false;
        this.currentHowlInstance.mute(this.isMuted);
      }
    }
  }

  onSeek(newProgress: number): void {
    if (this.currentHowlInstance) {
      const duration = this.currentHowlInstance.duration(); // Total duration in seconds
      const seekTime = (newProgress / 100) * duration; // Convert percentage to time
      this.currentHowlInstance.seek(seekTime); // Seek to the new time
      this.currentProgress = newProgress; // Update the progress bar
    }
  }

  formatTime(seconds?: number): string {
    if (!seconds || isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  onRandom(): void {
    if (this.nextQueue.length > 1) {
      for (let i = this.nextQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.nextQueue[i], this.nextQueue[j]] = [this.nextQueue[j], this.nextQueue[i]];
      }
    }
  }

  isLooping: boolean = false; // Add this variable to the class

  onLoop(): void {
    this.isLooping = !this.isLooping; // Toggle the looping state
    if (this.currentHowlInstance) {
      this.currentHowlInstance.loop(this.isLooping);
    }
  }

  isShuffled: boolean = false; // Add this variable for shuffle state

  onShuffle(): void {
    this.isShuffled = !this.isShuffled;
    if (this.isShuffled) {
      this.shuffleQueue();
    } else {
      // Restore the original queue order if needed
    }
  }

  shuffleQueue(): void {
    if (this.nextQueue.length > 1) {
      for (let i = this.nextQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.nextQueue[i], this.nextQueue[j]] = [this.nextQueue[j], this.nextQueue[i]];
      }
    }
  }

  onQueue(): void {
    // Implement queue functionality
    console.log('Queue clicked');
  }

  onFullscreen(): void {
    // Implement fullscreen functionality
    console.log('Fullscreen clicked');
  }

  addToWishList(song: ReadSong | SongContent) {
    this.loadingCreation = true;
    const songId = song.id || song.songId;
    if (!songId) {
      console.error("Song ID is undefined.");
      this.loadingCreation = false;
      return;
    }
    const favRequest: favouriteRequest = {
      songId: songId,
    };
    this.favouriteService.addToFavourites(favRequest);
  }

  removedFromWishList(song: ReadSong | SongContent) {
    const songId = song.id || song.songId; // Use `id` if available, otherwise fall back to `songId`

    if (!songId) {
      console.error("Song ID is undefined.");
      return;
    }
    this.favouriteService.removeFromFavourites(songId);
  }

  ngOnDestroy(): void {
    this.favouriteService.resetAddToFavouritesState();
    this.favouriteService.resetRemoveFromFavouritesState();
  }









}
