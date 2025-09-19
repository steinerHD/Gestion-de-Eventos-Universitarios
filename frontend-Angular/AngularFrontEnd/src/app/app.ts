import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OrganizacionExterna } from './organizacion-externa/organizacion-externa';
import { first } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, OrganizacionExterna],
  templateUrl: './app.html',
  styleUrl: './app.css',

})
export class App {
  protected readonly title = signal('AngularFrontEnd');
}
