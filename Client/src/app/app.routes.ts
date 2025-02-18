import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddSongComponent} from "./features/song/add-song/add-song.component";
import {DashboardComponent} from "./features/admin/dashboard/dashboard.component";



export const routes: Routes = [

  {
    path: "dashboard",
    component: DashboardComponent
  },

  {
    path: "add-song",
    component: AddSongComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
