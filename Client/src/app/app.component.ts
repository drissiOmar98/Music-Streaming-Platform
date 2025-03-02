import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterOutlet} from '@angular/router';
import {FaIconLibrary, FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {fontAwesomeIcons} from "./shared/font-awesome-icons";
import {NavigationComponent} from "./layout/navigation/navigation.component";
import {LibraryComponent} from "./layout/library/library.component";
import {Oauth2AuthService} from "./auth/oauth2-auth.service";
import {HeaderComponent} from "./layout/header/header.component";
import {ToastService} from "./service/toast.service";
import {NgbToast} from "@ng-bootstrap/ng-bootstrap";
import {PlayerComponent} from "./layout/player/player.component";
import {FooterComponent} from "./layout/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FontAwesomeModule, NavigationComponent, LibraryComponent, HeaderComponent, NgbToast, PlayerComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Music Streaming Platform';

  private faIconLibrary = inject(FaIconLibrary);
  private oauth2Service = inject(Oauth2AuthService);
  toastService = inject(ToastService);
  private router = inject(Router);

  isAdminPage(): boolean {
    return this.router.url.startsWith('/dashboard'); // Adjust if needed
  }

  ngOnInit(): void {
    //this.initAuthentication();
    this.initFontAwesome();
  }


  private initFontAwesome() {
    this.faIconLibrary.addIcons(...fontAwesomeIcons);
  }

  private initAuthentication(): void {
    this.oauth2Service.initAuthentication();
  }


}
