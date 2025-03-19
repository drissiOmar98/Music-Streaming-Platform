import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddSongComponent} from "./features/song/add-song/add-song.component";
import {SearchComponent} from "./features/search/search.component";
import {ArtistDetailsComponent} from "./features/artist/artist-details/artist-details.component";
import {MusicItemComponent} from "./shared/music-item/music-item.component";
import {MainLibraryComponent} from "./features/playlist/main-library/main-library.component";
import {ShowAllComponent} from "./features/home/show-all/show-all.component";
import {LikedComponent} from "./features/liked/liked/liked.component";
import {PlaylistComponent} from "./features/playlist/playlist/playlist.component";




export const routes: Routes = [

  {
    path: '',
    loadComponent: () => import('./features/home/home.component')
      .then(m => m.HomeComponent)
  },

  {
    path: 'dashboard',
    loadComponent: () => import('./features/admin/dashboard/dashboard.component')
      .then(m => m.DashboardComponent)
  },

  {
    path: 'search',
    component: SearchComponent
  },
  { path: 'artist/:id', component: ArtistDetailsComponent }, // Route for artist details
  { path: 'music-item/:id', component: MusicItemComponent },
  { path: 'library', component: MainLibraryComponent },
  { path: 'section', component: ShowAllComponent },
  {
    path: 'liked',
    component: LikedComponent,
  },
  {
    path: 'playlist/:id',
    component: PlaylistComponent,
  },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
