import {Component, effect, inject} from '@angular/core';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {Oauth2AuthService} from "../../auth/oauth2-auth.service";
import {ConnectedUser} from "../../shared/model/user.model";
import {Location} from "@angular/common";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  oauth2Service = inject(Oauth2AuthService);

  location = inject(Location);

  connectedUser: ConnectedUser | undefined;

  constructor() {
    this.listenToFetchUser();
  }


  private listenToFetchUser() {
    effect(() => {
      const userState = this.oauth2Service.fetchUser();
      if (userState.status === "OK"
        && userState.value?.email
        && userState.value.email !== this.oauth2Service.notConnected) {
        this.connectedUser = userState.value;
      }
    });
  }



  login(): void {
    this.oauth2Service.login();
  }

  logout(): void {
    this.oauth2Service.logout();
  }

  goBackward(): void {
    this.location.back();
  }

  goForward(): void {
    this.location.forward();
  }

  goToProfilePage(): void {
    this.oauth2Service.goToProfilePage();
  }


}
