import {Component, effect, inject, OnDestroy} from '@angular/core';
import {FooterStepComponent} from "./footer-step/footer-step.component";
import {InfosStepComponent} from "./steps/infos-step/infos-step.component";
import {PicturesStepComponent} from "./steps/pictures-step/pictures-step.component";
import {ToastService} from "../../../../../service/toast.service";
import {Step} from "./step.model";
import {NewArtistPicture} from "../../../../../service/model/picture.model";
import {CreatedArtist, NewArtist, NewArtistInfo} from "../../../../../service/model/artist.model";
import {ArtistService} from "../../../../../service/artist.service";
import {Router} from "@angular/router";
import {State} from "../../../../../shared/model/state.model";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: 'app-add-artist',
  standalone: true,
  imports: [
    FooterStepComponent,
    InfosStepComponent,
    PicturesStepComponent
  ],
  templateUrl: './add-artist.component.html',
  styleUrl: './add-artist.component.scss'
})
export class AddArtistComponent implements OnDestroy {

  toastService = inject(ToastService);
  artistService = inject(ArtistService);
  router = inject(Router);
  activeModal=inject(NgbActiveModal);


  INFO = "info";
  PHOTOS = "photos";

  newArtist: NewArtist = this.initializeNewArtist();

  constructor() {
    this.trackArtistCreationStatus();
    this.listenArtistCreation();
  }


  steps: Step[] = [
    {
      id: this.INFO,
      idNext: this.PHOTOS,
      idPrevious: null,
      isValid: false
    },
    {
      id: this.PHOTOS,
      idNext: null,
      idPrevious: this.INFO,
      isValid: false
    }
  ];

  currentStep = this.steps[0];

  loadingCreation = false;

  initializeNewArtist(): NewArtist {
    return {
      infos: {
        name: "",
        bio: "",
      },
      pictures: new Array<NewArtistPicture>()
    };
  }

  createArtist(): void {
    this.loadingCreation = true;
    this.artistService.create(this.newArtist);
  }

  ngOnDestroy(): void {
    this.artistService.resetArtistCreation();
  }

  trackArtistCreationStatus() {
    // Start a reactive effect to monitor changes in the creation status signal.
    effect(() => {
      if (this.artistService.createSig().status === "OK") {
        //this.router.navigate(["admin", "list"]);
        this.router.navigate(["/dashboard"]);
      }
    });
  }

  listenArtistCreation() {
    effect(() => {
      let createdArtistState = this.artistService.createSig();
      if (createdArtistState.status === "OK") {
        this.onCreateOk(createdArtistState);
      } else if (createdArtistState.status === "ERROR") {
        this.onCreateError();
      }
    });
  }

  onCreateOk(createdProductState: State<CreatedArtist>) {
    this.loadingCreation = false;
    this.toastService.show("Artist created successfully.", "SUCCESS");
    this.closeModal()
  }

  private onCreateError() {
    this.loadingCreation = false;
    this.toastService.show("Couldn't create your artist, please try again.", "DANGER");
  }


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

  onInfoChange(newInfo: NewArtistInfo) {
    this.newArtist.infos = newInfo;
    console.log("infos:", this.newArtist.infos);
  }
  onPictureChange(newPictures: NewArtistPicture[]) {
    this.newArtist.pictures = newPictures;
  }

  closeModal() {
    this.activeModal.dismiss();  // This will close the modal
  }





}
