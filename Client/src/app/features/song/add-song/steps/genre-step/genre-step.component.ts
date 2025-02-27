import {Component, EventEmitter, inject, input, OnInit, Output} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {Genre, GenreName} from "../../../../../service/model/genre.model";
import {GenreService} from "../../../../../service/genre.service";

@Component({
  selector: 'app-genre-step',
  standalone: true,
  imports: [
    FaIconComponent
  ],
  templateUrl: './genre-step.component.html',
  styleUrl: './genre-step.component.scss'
})


export class GenreStepComponent implements OnInit {

  categoryName = input.required<GenreName>();

  @Output()
  categoryChange = new EventEmitter<GenreName>();

  @Output()
  stepValidityChange = new EventEmitter<boolean>();

  genreService = inject(GenreService);

  genres: Genre[] | undefined;


  /**
   * Lifecycle hook that runs when the component is initialized.
   * Fetches the available categories from the service.
   */
  ngOnInit(): void {
    this.genres = this.genreService.getGenres();
  }

  /**
   * Method that handles selecting a category.
   * Emits the selected category and indicates the step is valid.
   *
   * @param newGenre - The new selected genre music of type GenreName.
   */
  onSelectGenre(newGenre: GenreName): void {
    this.categoryChange.emit(newGenre);
    this.stepValidityChange.emit(true);
  }


}
