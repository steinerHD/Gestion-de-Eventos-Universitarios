import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Adjust path based on location

@Component({
  selector: 'app-profile-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profile-menu.html',
  styleUrls: ['./profile-menu.css']
})
export class ProfileMenuComponent {
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Método que maneja la acción de visualizar los datos del usuario (HU 3.3).
   */
  visualizarDatos(): void {
    // Navigate programmatically to ensure consistency
    this.router.navigate(['/profile']);
    console.log('Navegando a la visualización/edición de datos.');
  }

  /**
   * Método que maneja la acción de cerrar la sesión (HU 3.5).
   */
  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/signin']);
    console.log('Sesión cerrada exitosamente.');
  }

  /**
   * Método que maneja la acción de cerrar el menú o el modal de perfil.
   */
  cerrarMenu(): void {
    this.router.navigate(['/home']);
    console.log('Menú de perfil cerrado.');
  }
}