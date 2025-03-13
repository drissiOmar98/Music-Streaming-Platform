import {Component, effect, EventEmitter, inject, input, OnInit, Output} from '@angular/core';
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
export class FollowArtistBtnComponent implements OnInit {
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
    this.followService.checkArtistInFollowedList(artistId);
  }

  followOrUnfollowArtist(artist: CardArtist): void {
    if (this.isFollowed.get(artist.id)) {
      this.unfollowArtist.emit(artist);
      this.followService.getIsArtistInFollowingListSignal(artist.id).set(State.Builder<boolean>().forSuccess(false));
    } else {
      this.followArtist.emit(artist);
      this.followService.getIsArtistInFollowingListSignal(artist.id).set(State.Builder<boolean>().forSuccess(true));
    }
  }

  getButtonFollowCLass(artistId: number): string {
    const isInFollowingList: boolean | undefined = this.isFollowed.get(artistId);
    return isInFollowingList ? 'follow-btn following' : 'follow-btn';
  }
}
