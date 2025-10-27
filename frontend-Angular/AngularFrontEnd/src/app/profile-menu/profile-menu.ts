import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Adjust path based on location
import { EventosApiService, EventoDTO } from '../services/eventos.api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-menu.html',
  styleUrls: ['./profile-menu.css']
})
export class ProfileMenuComponent implements OnInit{
  constructor(
    private eventosApiService: EventosApiService,
    private authService: AuthService,
    private router: Router   
  )
  {}
    currentUser: any = null;
    ngOnInit(): void {
    this.authService.getUserProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (err) => console.error('Error al obtener el perfil del usuario', err)
    });
  }
    get isSecretaria(): boolean { return this.currentUser?.tipoUsuario === 'Secretaria'; }
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


  misEventos(): void {
    this.router.navigate(['/my-events']);
    console.log('Navegando a Mis Eventos.');
  }
}