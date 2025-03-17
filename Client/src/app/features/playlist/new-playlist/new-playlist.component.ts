import {Component, effect, ElementRef, inject, OnDestroy, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbAlertModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {State} from "../../../shared/model/state.model";
import {Router} from "@angular/router";
import {ToastService} from "../../../service/toast.service";
import {CreatedPlaylist, NewPlaylist} from "../../../service/model/playlist.model";
import {PlaylistService} from "../../../service/playlist.service";


@Component({
  selector: 'app-new-playlist',
  standalone: true,
  imports: [
    FormsModule,
    FaIconComponent,
    ReactiveFormsModule,
    NgbAlertModule
  ],
  templateUrl: './new-playlist.component.html',
  styleUrl: './new-playlist.component.scss'
})
export class NewPlaylistComponent implements OnDestroy {

  private router = inject(Router);
  private toastService = inject(ToastService);
  playlistService = inject(PlaylistService);
  activeModal=inject(NgbActiveModal);

  newPlaylist: NewPlaylist = this.initializeNewPlaylist();

  playlistName = 'Ma playlist n° 1';
  playlistDescription = '';
  playlistImageUrl: string | ArrayBuffer | null = './assets/images/user_playlist/billy.jpg'; // Default image


  @ViewChild('detailsForm') formDescription: NgForm | undefined;
  @ViewChild('coverInput') coverInput!: ElementRef<HTMLInputElement>;

  loadingCreation = false;

  constructor() {
    //this.trackSongCreationStatus();
    this.listenPlaylistCreation();
  }



  private initializeNewPlaylist(): NewPlaylist {
    return {
      title: '',
      description: '',
      cover: undefined,
      coverContentType: undefined,
      songIds: undefined,
    };
  }




  onImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.playlistImageUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }


  private validateForm(): boolean {
    return !!this.formDescription?.valid;
  }



  closeModal() {
    this.activeModal.dismiss();  // This will close the modal
  }

  trackPlaylistCreationStatus() {
    // Start a reactive effect to monitor changes in the creation status signal.
    effect(() => {
      if (this.playlistService.addSig().status === "OK") {
        this.router.navigate(["/dashboard"]);
      }
    });
  }

  listenPlaylistCreation() {
    effect(() => {
      let createdPlaylistState = this.playlistService.addSig();
      if (createdPlaylistState.status === "OK") {
        this.onCreateOk(createdPlaylistState);
      } else if (createdPlaylistState.status === "ERROR") {
        this.onCreateError();
      }
    });
  }


  onCreateOk(createdPlaylistState: State<CreatedPlaylist>) {
    this.loadingCreation = false;
    this.toastService.show("Playlist created successfully.", "SUCCESS");
    this.closeModal()
  }

  private onCreateError() {
    this.loadingCreation = false;
    this.toastService.show("Couldn't create your Playlist, please try again.", "DANGER");
  }


  onUploadCover(target: EventTarget | null) {
    const coverFile = this.extractFileFromTarget(target);
    if (coverFile) {
      this.newPlaylist.cover = {
        file: coverFile,
        urlDisplay: URL.createObjectURL(coverFile)
      };
    }
  }

  onTrashCover(coverInput: HTMLInputElement) {
    this.newPlaylist.cover = undefined;
    coverInput.value = ''; // Reset the file input
  }

  private extractFileFromTarget(target: EventTarget | null): File | undefined {
    const htmlInputTarget = target as HTMLInputElement;
    if (htmlInputTarget.files && htmlInputTarget.files.length > 0) {
      return htmlInputTarget.files[0];
    }
    return undefined;
  }


  createPlaylist() {
    // Validate the form
    if (!this.validateForm()) {
      this.toastService.show("Please fill in the required fields.", "DANGER");
      return;
    }

    // Ensure cover is set
    if (!this.newPlaylist.cover) {
      this.newPlaylist.cover = {
        file: this.getDefaultCoverFile(),
        urlDisplay: './assets/images/user_playlist/billy.jpg'
      };
      this.newPlaylist.coverContentType = 'image/jpeg'; // Adjust content type if necessary
    }


    // Set loading state
    this.loadingCreation = true;

    // Call the service to create the playlist
    this.playlistService.createPlaylist(this.newPlaylist);
  }

  private getDefaultCoverFile(): File {
    const defaultImagePath = './assets/images/user_playlist/billy.jpg';
    const blob = new Blob([], { type: 'image/jpeg' }); // Empty blob, just for example
    return new File([blob], 'billy.jpg', { type: 'image/jpeg' });
  }


  ngOnDestroy(): void {
    this.playlistService.resetAddState();
  }


}
