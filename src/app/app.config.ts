import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import {provideRouter, withComponentInputBinding, withViewTransitions} from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {jwtInterceptor} from './core/interceptors/jwt-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
      provideBrowserGlobalErrorListeners(),
      provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes, withViewTransitions(), withComponentInputBinding()),
      provideHttpClient(withInterceptors([jwtInterceptor])),
  ]
};
