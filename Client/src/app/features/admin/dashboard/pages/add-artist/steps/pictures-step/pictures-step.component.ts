import {Component, EventEmitter, input, Output} from '@angular/core';
import {NewArtistPicture, NewEventPicture} from "../../../../../../../service/model/picture.model";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-pictures-step',
  standalone: true,
  imports: [
    FontAwesomeModule
  ],
  templateUrl: './pictures-step.component.html',
  styleUrl: './pictures-step.component.scss'
})
export class PicturesStepComponent {

  pictures = input.required<Array<NewArtistPicture | NewEventPicture>>();

  context = input<'artist' | 'event'>('artist'); // Default to artist

  @Output()
  picturesChange = new EventEmitter<Array<NewArtistPicture | NewEventPicture>>();

  @Output()
  stepValidityChange = new EventEmitter<boolean>();



  extractFileFromTarget(target: EventTarget | null) {
    const htmlInputTarget = target as HTMLInputElement;
    if (target === null || htmlInputTarget.files === null) {
      return null;
    }
    return htmlInputTarget.files;
  }

  onUploadNewPicture(target: EventTarget | null) {
    const picturesFileList = this.extractFileFromTarget(target);
    if(picturesFileList !== null) {
      for(let i = 0 ; i < picturesFileList.length; i++) {
        const picture = picturesFileList.item(i);
        if (picture !== null) {
          const displayPicture: NewArtistPicture | NewEventPicture = {
            file: picture,
            urlDisplay: URL.createObjectURL(picture)
          }
          this.pictures().push(displayPicture);
        }
      }
      this.picturesChange.emit(this.pictures());
      this.validatePictures();
    }
  }

  private validatePictures() {
    if (this.pictures().length >= 2) {
      this.stepValidityChange.emit(true);
    } else {
      this.stepValidityChange.emit(false);
    }
  }

  onTrashPicture(pictureToDelete: NewArtistPicture) {
    const indexToDelete = this.pictures().findIndex(picture => picture.file.name === pictureToDelete.file.name);
    this.pictures().splice(indexToDelete, 1);
    this.validatePictures();
  }



}
