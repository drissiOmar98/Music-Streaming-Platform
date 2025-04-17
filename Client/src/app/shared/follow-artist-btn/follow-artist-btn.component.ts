import {
  Component,
  effect,
  EventEmitter,
  inject,
  input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {ToastService} from "../../service/toast.service";
import {FollowService} from "../../service/follow.service";
import {CardArtist} from "../../service/model/artist.model";
import {State} from "../model/state.model";
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-follow-artist-btn',
  standalone: true,
  imports: [
    NgClass,
    NgIf
  ],
  templateUrl: './follow-artist-btn.component.html',
  styleUrl: './follow-artist-btn.component.scss'
})
export class FollowArtistBtnComponent implements OnInit,OnChanges,OnDestroy{
  toastService = inject(ToastService);
  followService = inject(FollowService);

  @Output() followArtist = new EventEmitter<CardArtist>();
  @Output() unfollowArtist = new EventEmitter<CardArtist>();

  artist = input.required<CardArtist>();

  isFollowed: Map<number, boolean> = new Map();



  constructor() {
    this.listenCheckIfArtistInFollowingList();
  }

  ngOnInit(): void {
    this.checkArtistInFollowingList(this.artist().id)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['artist'] && this.artist()) {
      console.log('Artist input changed:', this.artist());
      // Clear the previous artist's follow status
      this.isFollowed.clear();
      // Check if the new artist is followed
      this.checkArtistInFollowingList(this.artist().id);
    }
  }


  ngOnDestroy(): void {
    this.followService.resetAllIsArtistInFollowedStates();
  }


  private listenCheckIfArtistInFollowingList(): void {
    effect(() => {
      const itemStateSignal = this.followService.getIsArtistInFollowingListSignal(this.artist().id);
      const state = itemStateSignal();
      if (state.status === "OK") {
        this.isFollowed.set(this.artist().id, state.value ?? false);
      } else if (state.status === "ERROR") {
        this.toastService.show("Failed to check Followed Artist status", "DANGER");
      }
    });
  }


  private checkArtistInFollowingList(artistId: number): void {
    console.log('Checking if artist is in following list:', artistId);
    this.followService.checkArtistInFollowedList(artistId);
  }

  followOrUnfollowArtist(artist: CardArtist): void {
    console.log('Follow/Unfollow button clicked for artist:', artist);
    if (this.isFollowed.get(artist.id)) {
      console.log('Unfollowing artist:', artist.id);
      this.unfollowArtist.emit(artist);
      this.followService.getIsArtistInFollowingListSignal(artist.id).set(State.Builder<boolean>().forSuccess(false));
    } else {
      console.log('Following artist:', artist.id);
      this.followArtist.emit(artist);
      this.followService.getIsArtistInFollowingListSignal(artist.id).set(State.Builder<boolean>().forSuccess(true));
    }
  }

  getButtonFollowCLass(artistId: number): string {
    const isInFollowingList: boolean | undefined = this.isFollowed.get(artistId);
    return isInFollowingList ? 'follow-btn following' : 'follow-btn';
  }
}
