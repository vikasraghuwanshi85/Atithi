import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from '../services/token.interceptor';
import {provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
  	provideRouter(routes), 
  	provideClientHydration(),
  	provideHttpClient(withFetch(), withInterceptors([tokenInterceptor])),
  	provideAnimationsAsync()
  ]
};
