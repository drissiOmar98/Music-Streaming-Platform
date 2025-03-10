import {Component, effect, Input} from '@angular/core';
import {Router} from "@angular/router";
import {FavouriteService} from "../../../service/favourite.service";

@Component({
  selector: 'app-liked-details',
  standalone: true,
  imports: [],
  templateUrl: './liked-details.component.html',
  styleUrl: './liked-details.component.scss'
})
export class LikedDetailsComponent {
  wishListCount: number = 0;
  @Input() imgLeftLink: string | undefined;

  constructor(
    private favouriteService: FavouriteService) {
    this.subscribeToWishlistCount();
  }


  subscribeToWishlistCount(): void {
    // Using computed signals to track any updates to the wishlist count
    effect(() => {
      this.wishListCount = this.favouriteService.wishListCountSig();
    });
  }

}
