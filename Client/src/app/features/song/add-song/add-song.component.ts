import {Component, inject} from '@angular/core';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {NgbActiveModal, NgbAlertModule} from "@ng-bootstrap/ng-bootstrap";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {NewSong} from "../../../service/model/song.model";
import {SongService} from "../../../service/song.service";
import {Router} from "@angular/router";
import {ToastService} from "../../../service/toast.service";
import {CreateSongFormContent} from "./add-song-form.model";


type FlowStatus = 'init' | 'validation-file-error' | 'validation-cover-error' | 'success' | 'error';

@Component({
  selector: 'app-add-song',
  standalone: true,
  imports: [ReactiveFormsModule, NgbAlertModule, FontAwesomeModule],
  templateUrl: './add-song.component.html',
  styleUrl: './add-song.component.scss'
})
export class AddSongComponent {

  public songToCreate: NewSong = {};

  private formBuilder = inject(FormBuilder);
  private activeModal=inject(NgbActiveModal);

  private songService = inject(SongService);

  private router = inject(Router);

  private toastService = inject(ToastService);

  isCreating = false;

  flowStatus: FlowStatus = 'init';

  public createForm = this.formBuilder.nonNullable.group<CreateSongFormContent>({
    title: new FormControl('' ,{nonNullable: true, validators:[Validators.required]}),
    artistId: new FormControl(0, {nonNullable: true, validators: [Validators.required]}),
    cover: new FormControl(null, {nonNullable: true, validators: [Validators.required]}),
    file: new FormControl(null, {nonNullable: true, validators: [Validators.required]}),
  });

  closeModal() {
    this.activeModal.dismiss();  // This will close the modal
  }
























  private extractFileFromTarget(target: EventTarget | null): File | null {
    const htmlInputTarget = target as HTMLInputElement;
    if(target === null || htmlInputTarget.files === null) {
      return null;
    }
    return htmlInputTarget.files[0];
  }

  onUploadCover(target: EventTarget | null) {
    const cover = this.extractFileFromTarget(target);
    if(cover !== null) {
      this.songToCreate.cover = cover;
      this.songToCreate.coverContentType = cover.type;
    }
  }

  onUploadFile(target: EventTarget | null) {
    const file = this.extractFileFromTarget(target);
    if(file !== null) {
      this.songToCreate.file = file;
      this.songToCreate.fileContentType = file.type;
    }
  }

}
