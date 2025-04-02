import {Component, EventEmitter, input, Output, ViewChild} from '@angular/core';
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {NewEventInfo} from "../../../../../service/model/event.model";

@Component({
  selector: 'app-event-info-step',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './event-info-step.component.html',
  styleUrl: './event-info-step.component.scss'
})
export class EventInfoStepComponent {

  eventInfos = input.required<NewEventInfo>();

  @Output()
  infoChange = new EventEmitter<NewEventInfo>();

  @Output()
  stepValidityChange = new EventEmitter<boolean>();

  @ViewChild("formDescription")
  formDescription: NgForm | undefined;

  onTitleChange(newTitle: string) {
    this.eventInfos().title = newTitle;
    this.infoChange.emit(this.eventInfos());
    this.stepValidityChange.emit(this.validateForm());
  }

  onDescriptionChange(newDescription: string) {
    this.eventInfos().description = newDescription;
    this.infoChange.emit(this.eventInfos());
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
