import {FormControl} from "@angular/forms";

export type CreateSongFormContent = {
  title: FormControl<string>;
  artistId: FormControl<number>;
  cover: FormControl<File | null>;
  file: FormControl<File | null>;
}
