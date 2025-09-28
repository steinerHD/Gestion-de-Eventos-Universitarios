import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProfileMenu } from './profile-menu/profile-menu';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule, ProfileMenu],
  template: `
    <div class="container mt-5">
      <div class="card p-4 mx-auto" style="max-width: 600px;">
        <h3 class="mb-3 text-center">Bienvenido al Sistema de Gestión de Eventos Universitarios</h3>
        <p class="text-center mb-4">Has iniciado sesión correctamente.</p>
        <div class="d-flex justify-content-center">
          <button class="btn btn-primary me-2" (click)="menuOpen = true">Visualizar menú</button>
          <button class="btn btn-success" (click)="logout()">Cerrar Sesión</button>
        </div>
      </div>
      <app-profile-menu *ngIf="menuOpen" (close)="toggleMenu()"></app-profile-menu>
    </div>
  `,
  styles: []
})
export class HomeComponent {
  menuOpen = false;

  constructor(private router: Router) {}

  logout() {
    // Navega al login y puedes limpiar datos de sesión aquí si lo necesitas
    this.router.navigate(['/login']);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
