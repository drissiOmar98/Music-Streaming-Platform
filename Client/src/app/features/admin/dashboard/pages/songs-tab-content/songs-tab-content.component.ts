import {Component, inject, Inject} from '@angular/core';
import {NgForOf} from "@angular/common";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AddSongComponent} from "../../../../song/add-song/add-song.component";

@Component({
  selector: 'app-songs-tab-content',
  standalone: true,
  imports: [
    NgForOf,
    FontAwesomeModule
  ],
  templateUrl: './songs-tab-content.component.html',
  styleUrl: './songs-tab-content.component.scss'
})
export class SongsTabContentComponent {

  private modalService = inject(NgbModal);


  // Mock song data
  mockSongs = [
    {
      _id: '1',
      title: 'Song One',
      artist: 'Artist One',
      imageUrl: 'https://via.placeholder.com/50',
      createdAt: '2025-02-15T00:00:00Z',
    },
    {
      _id: '2',
      title: 'Song Two',
      artist: 'Artist Two',
      imageUrl: 'https://via.placeholder.com/50',
      createdAt: '2025-02-16T00:00:00Z',
    },
    {
      _id: '3',
      title: 'Song Three',
      artist: 'Artist Three',
      imageUrl: 'https://via.placeholder.com/50',
      createdAt: '2025-02-17T00:00:00Z',
    },
  ];

  // Mock delete method (just logs the song to the console for now)
  deleteSong(song: any) {
    console.log(`Song to delete: ${song.title}`);
    // Here you can add logic to delete the song from the list, like:
    // this.mockSongs = this.mockSongs.filter(s => s._id !== song._id);
  }

  openAddSongModal() {
    const modalRef = this.modalService.open(AddSongComponent, {
      centered: true, // Optional, to center the modal
      size: 'lg' // Optional, adjust the size
    });

    // You can also pass data to the modal if needed:
    // modalRef.componentInstance.someInput = 'value';
  }
}
