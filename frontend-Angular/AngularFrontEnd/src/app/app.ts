import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OrganizacionExternaComponent } from './organizacion-externa/organizacion-externa';
import { first } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, OrganizacionExternaComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',

})
export class App {
  protected readonly title = signal('AngularFrontEnd');
    // Señal para gestionar el estado de la ventana emergente.
  // Es `false` por defecto, lo que significa que la ventana está cerrada.
  isModalOpen = signal(false);

  // Método para abrir la ventana emergente
  openModal(): void {
    this.isModalOpen.set(true);
  }

  // Método para cerrar la ventana emergente
  closeModal(): void {
    this.isModalOpen.set(false);
}
}

  standalone: true
