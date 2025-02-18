import {Component, EventEmitter, input, Output, ViewChild} from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {NewArtistInfo} from "../../../../../../../service/model/artist.model";

@Component({
  selector: 'app-infos-step',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './infos-step.component.html',
  styleUrl: './infos-step.component.scss'
})
export class InfosStepComponent {

  infos = input.required<NewArtistInfo>();

  @Output()
  infoChange = new EventEmitter<NewArtistInfo>();

  @Output()
  stepValidityChange = new EventEmitter<boolean>();

  @ViewChild("formDescription")
  formDescription: NgForm | undefined;

  onTitleChange(newTitle: string) {
    this.infos().name = newTitle;
    this.infoChange.emit(this.infos());
    this.stepValidityChange.emit(this.validateForm());
  }

  onDescriptionChange(newBio: string) {
    this.infos().bio = newBio;
    this.infoChange.emit(this.infos());
    this.stepValidityChange.emit(this.validateForm());
  }

  private validateForm(): boolean {
    if (this.formDescription) {
      return this.formDescription?.valid!;
    } else {
      return false;
    }
  }


}
