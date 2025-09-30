import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="container mt-5">
      <div class="card p-4 mx-auto" style="max-width: 600px;">
        <h3 class="mb-3 text-center">Bienvenido al Sistema de Gestión de Eventos Universitarios</h3>
        <p class="text-center mb-4">Has iniciado sesión correctamente.</p>
        <div class="d-flex justify-content-center">
          <button class="btn btn-primary me-2" routerLink="/login">Volver al Login</button>
          <button class="btn btn-success" (click)="logout()">Cerrar Sesión</button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class HomeComponent {
  logout() {
    // Aquí puedes agregar la lógica real para cerrar sesión
    console.log('Cerrando sesión...');
    // Ejemplo simple: recargar la página
    window.location.reload();
  }
}
