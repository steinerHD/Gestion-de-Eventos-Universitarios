import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile-menu.html',
  styleUrls: ['./profile-menu.css']
})

export class PerfilComponent {

  // Constructor base
  constructor() { }

  /**
   * Método que maneja la acción de visualizar los datos del usuario (HU 3.3).
   */
  visualizarDatos(): void {
    // Aquí se implementaría la lógica para navegar a la vista de edición/consulta de perfil
    console.log('Navegando a la visualización/edición de datos.');
  }

  /**
   * Método que maneja la acción de cerrar la sesión (HU 3.5).
   * Esta acción es clave para el control de acceso y permisos por roles de usuario [5].
   */
  cerrarSesion(): void {
    // Aquí se llamaría al servicio de autenticación para invalidar el token/sesión
    console.log('Sesión cerrada exitosamente.');
  }

  /**
   * Método que maneja la acción de cerrar el menú o el modal de perfil.
   */
  cerrarMenu(): void {
    // Aquí se implementaría la lógica para ocultar el componente/modal
    console.log('Menú de perfil cerrado.');
  }
}