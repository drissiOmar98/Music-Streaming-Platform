import {
  Component, effect,
  EventEmitter,
  HostListener,
  inject,
  Input,
  input, OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {ReadSong} from "../../service/model/song.model";
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {animate, style, transition, trigger} from "@angular/animations";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Playlist} from "../../service/model/playlist.model";
import {SmallPlaylistCardComponent} from "../small-playlist-card/small-playlist-card.component";
import {PlaylistService} from "../../service/playlist.service";
import {ToastService} from "../../service/toast.service";
import {State} from "../model/state.model";

@Component({
  selector: 'app-playlist-btn',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
    SmallPlaylistCardComponent
  ],
  templateUrl: './playlist-btn.component.html',
  styleUrl: './playlist-btn.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' })),
      ]),
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(10px)' })),
      ]),
    ]),
  ],
})
export class PlaylistBtnComponent implements OnInit {

  private modalService = inject(NgbModal);
  playlistService = inject(PlaylistService);
  toastService = inject(ToastService);

  @ViewChild('addToPlaylistModal') addToPlaylistModal!: TemplateRef<any>;

  song = input.required<ReadSong>();
  @Input() userPlaylists: Playlist[] = [];
  @Output() addedToPlaylist = new EventEmitter<{ song: ReadSong, playlist: Playlist }>();
  @Output() removedFromPlaylist = new EventEmitter<{ song: ReadSong, playlist: Playlist }>();
  @Output() createPlaylist = new EventEmitter<string>();
  @Output() goToAlbum = new EventEmitter<any>();
  @Output() shareSong = new EventEmitter<any>();

  openDropdown: boolean = false;
  searchQuery: string = '';
  selectedPlaylists: Set<any> = new Set(); // Track selected playlists

  // Map to store whether a song is in a playlist
  inPlaylist: Map<number, boolean> = new Map();

  constructor() {
    // Listen for changes in the playlist state
    this.listenCheckIfSongInPlaylist();
  }

  ngOnInit(): void {
    this.checkSongInPlaylists(); // Check if the song is in each playlist
  }


  // Listen for clicks on the document
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const dropdownElement = document.querySelector('.dropdown');
    const target = event.target as Element | null;

    // Check if the click is outside the dropdown
    if (dropdownElement && target && !dropdownElement.contains(target)) {
      this.openDropdown = false;
    }
  }



  toggleDropdown(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent click from bubbling up to the document
    }
    this.openDropdown = !this.openDropdown;
  }


  openAddToPlaylistModal() {
    // Initialize selectedPlaylists based on inPlaylist
    this.selectedPlaylists.clear();
    for (const playlist of this.userPlaylists) {
      if (this.inPlaylist.get(playlist.id)) {
        this.selectedPlaylists.add(playlist);
      }
    }

    const modalRef = this.modalService.open(this.addToPlaylistModal, {
      centered: true,
      size: 'sm',
      windowClass: 'spotify-modal',
    });
  }

  filteredPlaylists() {
    return this.userPlaylists.filter(p => p.title.toLowerCase().includes(this.searchQuery.toLowerCase()));
  }

  // Check if a playlist is selected
  isPlaylistSelected(playlist: Playlist): boolean {
    return this.selectedPlaylists.has(playlist) || this.inPlaylist.get(playlist.id) === true;
  }



  // Toggle playlist selection
  togglePlaylistSelection(playlist: Playlist) {
    const song = this.song();
    const songId = song.id;
    const playlistId = playlist.id;

    if (this.selectedPlaylists.has(playlist)) {
      // If the playlist is already selected, uncheck it and remove the song immediately
      this.selectedPlaylists.delete(playlist);
      this.removedFromPlaylist.emit({ song, playlist });
      this.playlistService.getIsSongInPlaylistSignal(playlistId, songId).set(State.Builder<boolean>().forSuccess(false));
      this.inPlaylist.set(playlistId, false); // Update the inPlaylist state
    } else {
      // If the playlist is not selected, check it (but don't add the song yet)
      this.selectedPlaylists.add(playlist);
    }
  }

  // Add the song to the selected playlists
  addToSelectedPlaylists() {
    const song = this.song();
    this.selectedPlaylists.forEach(playlist => {
      const playlistId = playlist.id;
      if (!this.inPlaylist.get(playlistId)) {
        // Only add the song if it's not already in the playlist
        this.addedToPlaylist.emit({ song, playlist });
        this.playlistService.getIsSongInPlaylistSignal(playlistId, song.id).set(State.Builder<boolean>().forSuccess(true));
        this.inPlaylist.set(playlistId, true); // Update the inPlaylist state
      }
    });
    this.selectedPlaylists.clear(); // Clear the selection after adding
  }

  createNewPlaylist() {
    const playlistName = prompt("Enter new playlist name:");
    if (playlistName) {
      this.createPlaylist.emit(playlistName);
    }
  }

  // Check if the song is in each playlist
  private checkSongInPlaylists(): void {
    for (const playlist of this.userPlaylists) {
      this.checkSongInPlaylist(this.song().id, playlist.id);
    }
  }

  // Check if a song is in a specific playlist
  private checkSongInPlaylist(songId: number, playlistId: number): void {
    this.playlistService.isSongInPlaylist(playlistId, songId);
  }


  // Listen for changes in the playlist state
  private listenCheckIfSongInPlaylist(): void {
    effect(() => {
      for (const playlist of this.userPlaylists) {
        const itemStateSignal = this.playlistService.getIsSongInPlaylistSignal(playlist.id, this.song().id);
        const state = itemStateSignal();
        if (state.status === "OK") {
          this.inPlaylist.set(playlist.id, state.value ?? false);
        } else if (state.status === "ERROR") {
          this.toastService.show("Failed to check song status", "DANGER");
        }
      }
    });
  }

  // Add or remove a song from a playlist
  addRemoveSongFromPlaylist(playlist: Playlist): void {
    const song = this.song();
    const songId = song.id;
    const playlistId = playlist.id;

    if (this.inPlaylist.get(playlistId)) {
      // If the song is already in the playlist, remove it
      this.removedFromPlaylist.emit({ song, playlist });
      this.playlistService.getIsSongInPlaylistSignal(playlistId, songId).set(State.Builder<boolean>().forSuccess(false));
      this.inPlaylist.set(playlistId, false); // Update the inPlaylist state
      this.selectedPlaylists.delete(playlist); // Remove from selected playlists
    } else {
      // If the song is not in the playlist, add it
      this.addedToPlaylist.emit({ song, playlist });
      this.playlistService.getIsSongInPlaylistSignal(playlistId, songId).set(State.Builder<boolean>().forSuccess(true));
      this.inPlaylist.set(playlistId, true); // Update the inPlaylist state
      this.selectedPlaylists.add(playlist); // Add to selected playlists
    }
  }



}
