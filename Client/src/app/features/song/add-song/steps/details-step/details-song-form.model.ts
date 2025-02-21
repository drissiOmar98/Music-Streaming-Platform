import {FormControl} from "@angular/forms";

export type detailsSongFormContent = {
  title: FormControl<string>;
  cover: FormControl<File | null>;
  file: FormControl<File | null>;
}
