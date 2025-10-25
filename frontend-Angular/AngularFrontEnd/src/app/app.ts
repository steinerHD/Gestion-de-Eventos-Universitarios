import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import 'remixicon/fonts/remixicon.css';
import 'notyf/notyf.min.css';
import { Notyf } from 'notyf';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {}

export const notyf = new Notyf({
  duration: 5000,
  position: { x: 'right', y: 'bottom' },
});
