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
    switch (usuario.tipoUsuario) {
      case 'estudiante':
        return `Estudiante - ${usuario.programa || 'Programa'}`;
      case 'docente':
        return `Docente - ${usuario.unidadAcademica || 'Unidad'}`;
      case 'secretaria':
        return `Secretaría - ${usuario.facultad || 'Facultad'}`;
      default:
        return usuario.tipoUsuario;
    }
  }
}
