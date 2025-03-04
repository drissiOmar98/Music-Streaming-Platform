import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddSongComponent} from "./features/song/add-song/add-song.component";
import {SearchComponent} from "./features/search/search.component";
import {ArtistDetailsComponent} from "./features/artist/artist-details/artist-details.component";




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



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
