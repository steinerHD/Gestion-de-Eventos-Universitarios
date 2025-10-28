import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioDTO } from '../../services/usuarios.api.service';

@Component({
  selector: 'app-selected-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './selected-users.html',
  styleUrls: ['./selected-users.css']
})
export class SelectedUsersComponent {
  @Input() selectedUsers: UsuarioDTO[] = [];
  @Output() userRemoved = new EventEmitter<UsuarioDTO>();

  removeUser(user: UsuarioDTO): void {
    this.userRemoved.emit(user);
  }

  getUsuarioTypeLabel(usuario: UsuarioDTO): string {
    // Algunos usuarios pueden describir su tipo en `tipoUsuario` o vía una propiedad anidada `secretaria`.
    const tipo = (usuario as any).tipoUsuario || ((usuario as any).secretaria ? 'secretaria' : undefined);
    switch (tipo) {
      case 'estudiante':
        return `Estudiante - ${usuario.programa || 'Programa'}`;
      case 'docente':
        return `Docente - ${usuario.unidadAcademica || 'Unidad'}`;
      case 'secretaria':
        // intentar obtener la facultad desde la forma anidada si existe
        const facultad = (usuario as any).facultad || (usuario as any).secretaria?.facultad || 'Facultad';
        return `Secretaría - ${facultad}`;
      default:
        return (usuario as any).tipoUsuario || 'Usuario';
    }
  }
}
