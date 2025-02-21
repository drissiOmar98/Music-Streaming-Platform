import {
  Component,
  effect, ElementRef,
  EventEmitter,
  inject,
  Input,
  input,
  OnDestroy,
  OnInit,
  Output,
  signal,
  ViewChild
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";


import {NgbAlertModule} from "@ng-bootstrap/ng-bootstrap";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {NewSong, NewSongCover} from "../../../../../service/model/song.model";
import {NgIf} from "@angular/common";



type FlowStatus = 'init' | 'validation-file-error' | 'validation-cover-error' | 'success' | 'error';
@Component({
  selector: 'app-details-step',
  standalone: true,
  imports: [
    ReactiveFormsModule, NgbAlertModule, FontAwesomeModule, FormsModule],
  templateUrl: './details-step.component.html',
  styleUrl: './details-step.component.scss'
})

export class DetailsStepComponent {
  infos = input.required<NewSong>();

  @Output() detailsChange = new EventEmitter<NewSong>();
  @Output() stepValidityChange = new EventEmitter<boolean>();

  @ViewChild('detailsForm') formDescription: NgForm | undefined;
  @ViewChild('coverInput') coverInput!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  uploadProgress: number = 0; // Track upload progress
  private uploadInterval: any; // Interval for simulating upload progress

  onTitleChange(newTitle: string) {
    const updatedInfos = { ...this.infos(), title: newTitle };
    this.detailsChange.emit(updatedInfos);
    this.stepValidityChange.emit(this.validateForm());
  }

  onUploadCover(target: EventTarget | null) {
    const coverFile = this.extractFileFromTarget(target);
    if (coverFile) {
      const cover: NewSongCover = {
        file: coverFile,
        urlDisplay: URL.createObjectURL(coverFile)
      };
      const updatedInfos = {
        ...this.infos(),
        cover,
        coverContentType: coverFile.type
      };
      this.detailsChange.emit(updatedInfos);
      this.stepValidityChange.emit(this.validateForm());
    }
  }

  onUploadFile(target: EventTarget | null) {
    const file = this.extractFileFromTarget(target);
    if (file) {
      const updatedInfos = { ...this.infos(), file, fileContentType: file.type };
      this.detailsChange.emit(updatedInfos);
      this.stepValidityChange.emit(this.validateForm());

      // Simulate file upload progress
      this.simulateUploadProgress();
    }
  }

  simulateUploadProgress() {
    this.uploadProgress = 0;
    this.uploadInterval = setInterval(() => {
      if (this.uploadProgress < 100) {
        this.uploadProgress += 10; // Increment progress by 10%
      } else {
        clearInterval(this.uploadInterval); // Stop the interval when progress reaches 100%
      }
    }, 300); // Update progress every 300ms
  }

  onTrashCover(coverInput: HTMLInputElement) {
    const updatedInfos = { ...this.infos(), cover: undefined, coverContentType: undefined };
    this.detailsChange.emit(updatedInfos);
    this.stepValidityChange.emit(this.validateForm());

    // Reset the file input value
    coverInput.value = '';
  }

  onTrashFile(fileInput: HTMLInputElement) {
    const updatedInfos = { ...this.infos(), file: undefined, fileContentType: undefined };
    this.detailsChange.emit(updatedInfos);
    this.stepValidityChange.emit(this.validateForm());

    // Reset the file input value
    fileInput.value = '';
    this.uploadProgress = 0; // Reset progress
    clearInterval(this.uploadInterval); // Clear the interval
  }

  private validateForm(): boolean {
    return !!this.formDescription?.valid;
  }

  private extractFileFromTarget(target: EventTarget | null): File | undefined {
    const htmlInputTarget = target as HTMLInputElement;
    if (htmlInputTarget.files && htmlInputTarget.files.length > 0) {
      return htmlInputTarget.files[0];
    }
    return undefined;
  }
}
