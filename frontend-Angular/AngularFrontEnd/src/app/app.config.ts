import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
        withFetch(),
        // He comentado el interceptor porque no está definido.
        // Cuando lo crees, puedes descomentar la siguiente línea.
        // withInterceptors([ErrorResponseInterceptor])
    ),
  ]
};
