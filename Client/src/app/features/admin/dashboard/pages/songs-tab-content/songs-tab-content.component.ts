import {Component, effect, inject, Inject, OnDestroy, OnInit} from '@angular/core';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddSongComponent} from "../../../../song/add-song/add-song.component";
import {ToastService} from "../../../../../service/toast.service";
import {ReadSong} from "../../../../../service/model/song.model";
import {SongService} from "../../../../../service/song.service";
import {filter, Subject, take, takeUntil} from "rxjs";
import {Oauth2AuthService} from "../../../../../auth/oauth2-auth.service";
import {TabService} from "../../../../../service/tab.service";
import {ConnectedUser} from "../../../../../shared/model/user.model";

@Component({
  selector: 'app-songs-tab-content',
  standalone: true,
  imports: [
    FontAwesomeModule
  ],
  templateUrl: './songs-tab-content.component.html',
  styleUrl: './songs-tab-content.component.scss'
})
export class SongsTabContentComponent implements OnInit,OnDestroy {

  private modalService = inject(NgbModal);
  toastService = inject(ToastService);
  songService = inject(SongService);
  authService = inject(Oauth2AuthService);
  tabService = inject(TabService);


  isLoading = false;

  //allSongs: Array<ReadSong> | undefined;

  fullSongstList: Array<ReadSong> = [];
  allSongs: Array<ReadSong> | undefined = [];
  private destroy$ = new Subject<void>();


  constructor() {
    this.listenFetchAllSongs();
  }

  ngOnInit(): void {
    this.tabService.activeTab$.pipe(
      filter(tab => tab === 'songs'), // Only react to 'songs' tab
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.fetchSongs();
    });
  }

  private fetchSongs() {
    this.isLoading = true;
    this.songService.getSongs();
  }

  private listenFetchAllSongs() {
    effect(() => {
      const allSongsState = this.songService.getAllSig();
      if (allSongsState.status === "OK") {
        this.isLoading= false;
        this.fullSongstList = allSongsState.value || [] ;
        this.allSongs = [...this.fullSongstList];
      } else if (allSongsState.status === "ERROR") {
        this.toastService.show("Error when fetching the Songs.", "DANGER");
      }
    });
  }

  deleteSong(song: any) {
    console.log(`Song to delete: ${song.title}`);
  }
  openAddSongModal() {
    const modalRef = this.modalService.open(AddSongComponent, {
      centered: true,
      size: 'lg'
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.songService.resetGetAllState();
  }
}
