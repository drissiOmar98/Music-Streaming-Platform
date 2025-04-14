import {Component, effect, inject, OnDestroy} from '@angular/core';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {NgbActiveModal, NgbAlertModule} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {NewSong} from "../../../service/model/song.model";
import {SongService} from "../../../service/song.service";
import {Router} from "@angular/router";
import {ToastService} from "../../../service/toast.service";
import {FooterStepComponent} from "../../admin/dashboard/pages/add-artist/footer-step/footer-step.component";
import {InfosStepComponent} from "../../admin/dashboard/pages/add-artist/steps/infos-step/infos-step.component";
import {
    PicturesStepComponent
} from "../../admin/dashboard/pages/add-artist/steps/pictures-step/pictures-step.component";
import {Step} from "../../admin/dashboard/pages/add-artist/step.model";
import {ArtistStepComponent} from "./steps/artist-step/artist-step.component";
import {GenreName} from "../../../service/model/genre.model";
import {GenreStepComponent} from "./steps/genre-step/genre-step.component";
import {DetailsStepComponent} from "./steps/details-step/details-step.component";
import {State} from "../../../shared/model/state.model";
import {CreatedArtist} from "../../../service/model/artist.model";




@Component({
  selector: 'app-add-song',
  standalone: true,
  imports: [ReactiveFormsModule, NgbAlertModule, FontAwesomeModule, FooterStepComponent, InfosStepComponent, PicturesStepComponent, ArtistStepComponent, GenreStepComponent, DetailsStepComponent],
  templateUrl: './add-song.component.html',
  styleUrl: './add-song.component.scss'
})
export class AddSongComponent implements OnDestroy {

  private songService = inject(SongService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  private formBuilder = inject(FormBuilder);
  private activeModal=inject(NgbActiveModal);

  newSong: NewSong = this.initializeNewSong();

  constructor() {
    this.trackSongCreationStatus();
    this.listenSongCreation();
  }

  trackSongCreationStatus() {
    // Start a reactive effect to monitor changes in the creation status signal.
    effect(() => {
      if (this.songService.addSig().status === "OK") {
        this.router.navigate(["/dashboard"]);
      }
    });
  }

  listenSongCreation() {
    effect(() => {
      let createdSongState = this.songService.addSig();
      if (createdSongState.status === "OK") {
        this.onCreateOk(createdSongState);
      } else if (createdSongState.status === "ERROR") {
        this.onCreateError();
      }
    });
  }


  private initializeNewSong(): NewSong {
    return {
      title: '',
      artistId: null!,
      genre: 'ELECTRONIC',
      file: undefined,
      fileContentType: undefined,
      cover: undefined,
      coverContentType: undefined,
    };
  }





  GENRE = "genre";
  ARTIST = "artist";
  DETAILS = "details";

  steps: Step[] = [
    {
      id: this.GENRE,
      idNext: this.ARTIST,
      idPrevious: null,
      isValid: false
    },
    {
      id: this.ARTIST,
      idNext: this.DETAILS,
      idPrevious: this.GENRE,
      isValid: false
    },
    {
      id: this.DETAILS,
      idNext: null,
      idPrevious: this.ARTIST,
      isValid: false
    }
  ];

  currentStep = this.steps[0];

  loadingCreation = false;





  nextStep(): void {
    if (this.currentStep.idNext !== null) {
      this.currentStep = this.steps.filter((step: Step) => step.id === this.currentStep.idNext)[0];
    }
  }

  previousStep(): void {
    if (this.currentStep.idPrevious !== null) {
      this.currentStep = this.steps.filter((step: Step) => step.id === this.currentStep.idPrevious)[0];
    }
  }

  isAllStepsValid(): boolean {
    return this.steps.filter(step => step.isValid).length === this.steps.length;
  }

  onValidityChange(validity: boolean) {
    this.currentStep.isValid = validity;
  }

  createSong() {
    this.loadingCreation = true;
    this.songService.add(this.newSong);
  }

  onCategoryChange(newCategory: GenreName): void {
    this.newSong.genre = newCategory;
  }

  onArtistSelected(artistId: number): void {
    this.newSong.artistId = artistId
  }

  onDetailsChange(details: NewSong): void {
    this.newSong =details ; // Merge details into newSong
    console.log(this.newSong);
  }

  ngOnDestroy(): void {
  }

  onCreateOk(createdProductState: State<CreatedArtist>) {
    this.loadingCreation = false;
    this.toastService.show("Song created successfully.", "SUCCESS");
    this.closeModal()
  }

  private onCreateError() {
    this.loadingCreation = false;
    this.toastService.show("Couldn't create your Song, please try again.", "DANGER");
  }

  closeModal() {
    this.activeModal.dismiss();  // This will close the modal
  }






}
