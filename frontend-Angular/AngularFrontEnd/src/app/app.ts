import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OrganizacionExternaComponent } from './organizacion-externa/organizacion-externa';
import { Avales } from './avales/avales';
import { first } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, OrganizacionExternaComponent, Avales],
  templateUrl: './app.html',
  styleUrl: './app.css',

})


export class App {
  protected readonly title = signal('AngularFrontEnd');
    // Señal para gestionar el estado de la ventana emergente.
  isModalOpen = signal(false);


  openModal(): void {
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
}
}

  standalone: true
