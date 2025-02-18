import {Component, Input} from '@angular/core';
import {CommonModule, NgClass} from "@angular/common";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [
    NgClass,CommonModule,FontAwesomeModule
  ],
  templateUrl: './dashboard-stats.component.html',
  styleUrl: './dashboard-stats.component.scss'
})
export class DashboardStatsComponent {

  @Input() stats: any;

}
