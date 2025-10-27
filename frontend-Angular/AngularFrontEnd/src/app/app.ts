import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import 'remixicon/fonts/remixicon.css';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet></router-outlet>
    <script>const notyf = new Notyf()</script>
  `
})

export class AppComponent {}

export const appConfig = {
  
  providers: [provideRouter(routes)]
};

export const notyf = new Notyf({
  duration: 5000,
  position: { x: 'right', y: 'bottom' },
});