import {APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideHttpClient, withInterceptors} from '@angular/common/http';

import { routes } from './app.routes';
import {authInterceptor} from "./auth/http-auth.interceptor";
import {authExpiredInterceptor} from "./auth/auth-expired.interceptor";
import {provideAnimations} from "@angular/platform-browser/animations";
import {Oauth2AuthService} from "./auth/oauth2-auth.service";

export function initializeAuth(oauth2AuthService: Oauth2AuthService) {
  return () => oauth2AuthService.initAuthentication();
}

export const appConfig: ApplicationConfig = {
  providers: [

    provideHttpClient(withInterceptors([authInterceptor, authExpiredInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [Oauth2AuthService],
      multi: true,
    },
  ],
};
