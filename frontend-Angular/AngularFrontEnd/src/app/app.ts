import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <router-outlet></router-outlet>
  `
})

export class AppComponent {}

export const appConfig = {
  providers: [provideRouter(routes)]
};
