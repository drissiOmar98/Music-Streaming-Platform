import {Component, effect, inject, OnInit} from '@angular/core';
import {ToastService} from "../../../service/toast.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Artist, DisplayPicture} from "../../../service/model/artist.model";
import {ArtistService} from "../../../service/artist.service";
import {map} from "rxjs";
import {NgClass, NgIf, NgStyle} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-artist-details',
  standalone: true,
  imports: [
    NgClass,
    NgStyle,
    NgIf,
    FaIconComponent
  ],
  templateUrl: './artist-details.component.html',
  styleUrl: './artist-details.component.scss'
})
export class ArtistDetailsComponent implements OnInit  {

  toastService = inject(ToastService);
  artistService = inject(ArtistService)
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  artist: Artist | undefined;
  loading = true;
  currentArtistId!: number;
  activeIndex: number = 0;
  displayCustom!: boolean;
  coverPicture?: DisplayPicture;
  profilePicture?: DisplayPicture;
  showPlayButton: boolean = false;

  ngOnInit(): void {
    this.extractIdParamFromRouter();
  }

  constructor() {
    this.listenToFetchArtist();
  }

  private extractIdParamFromRouter() {
    this.activatedRoute.paramMap.pipe(
      map(params => params.get('id')),
      map(id => id ? +id : null)
    ).subscribe({
      next: artistId => {
        if (artistId !== null) {
          this.currentArtistId=artistId;
          this.fetchArtistDetails(artistId);
        } else {
          this.toastService.
          show("Invalid artist ID", "DANGER");
        }
      },
      error: () => {
        this.toastService.
        show("Error extracting artist ID", "DANGER");
      }
    });
  }

  private fetchArtistDetails(artistId: number) {
    this.loading = true;
    this.currentArtistId=artistId;
    this.artistService.getArtistById(artistId);
  }


  private listenToFetchArtist() {
    effect(() => {
      const artistByIdState = this.artistService.getArtistByIdSig();
      if (artistByIdState.status === "OK") {
        this.loading = false;
        this.artist = artistByIdState.value;
        if (this.artist) {
          this.artist.pictures = this.putCoverPictureFirst(this.artist.pictures);

          // Assign the first picture as profilePicture
          this.coverPicture = this.artist.pictures.length > 0 ? this.artist.pictures[0] : undefined;

          // Assign the last picture as coverPicture
          this.profilePicture = this.artist.pictures.length > 1 ? this.artist.pictures[this.artist.pictures.length - 1] : this.profilePicture;
        }
      } else if (artistByIdState.status === "ERROR") {
        this.loading = false;
        this.toastService.show("Error when fetching the artist", "DANGER");
      }
    });
  }

  private putCoverPictureFirst(pictures: Array<DisplayPicture>) {
    if (!pictures || pictures.length === 0) return pictures;

    const coverIndex = pictures.findIndex(picture => picture.isCover);

    if (coverIndex !== -1) {
      const cover = pictures.splice(coverIndex, 1)[0];
      pictures.push(cover); // Put the cover picture at the end
    }

    return pictures;
  }



  imageClick(index: number) {
    this.activeIndex = index;
    this.displayCustom = true;
  }

}
