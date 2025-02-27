import {Component, inject, Inject} from '@angular/core';
import {DashboardHeaderComponent} from "./pages/dashboard-header/dashboard-header.component";
import {DashboardStatsComponent} from "./pages/dashboard-stats/dashboard-stats.component";
import {SongsTabContentComponent} from "./pages/songs-tab-content/songs-tab-content.component";
import {ArtistsTabContentComponent} from "./pages/artists-tab-content/artists-tab-content.component";
import {CommonModule} from "@angular/common";
import {TabService} from "../../../service/tab.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DashboardHeaderComponent,
    DashboardStatsComponent,
    SongsTabContentComponent,
    ArtistsTabContentComponent, CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  tabService = inject(TabService);

  activeTab: string = 'songs';

  setActiveTab(tab: string) {
    this.tabService.setActiveTab(tab);
  }

  stats = {
    totalSongs: 100,
    totalAlbums: 50,
    totalArtists: 20,
    totalUsers: 5000
  };

}
