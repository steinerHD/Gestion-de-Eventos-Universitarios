import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
});
