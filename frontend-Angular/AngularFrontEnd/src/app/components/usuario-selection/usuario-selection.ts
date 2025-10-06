import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosApiService, UsuarioDTO } from '../../services/usuarios.api.service';

@Component({
  selector: 'app-usuario-selection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-selection.html',
  styleUrls: ['./usuario-selection.css']
})
export class UsuarioSelectionComponent implements OnInit {
  @Input() showModal: boolean = false;
  @Output() modalClosed = new EventEmitter<void>();
  @Output() usuarioSelected = new EventEmitter<UsuarioDTO>();

  usuarios: UsuarioDTO[] = [];
  filteredUsuarios: UsuarioDTO[] = [];
  searchQuery: string = '';

  constructor(
    private usuariosApi: UsuariosApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.usuariosApi.getAll().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.filteredUsuarios = usuarios;
      },
      error: (error) => console.error('Error al cargar usuarios:', error)
    });
  }

  searchUsuarios(): void {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      this.filteredUsuarios = this.usuarios;
    } else {
      const q = this.searchQuery.toLowerCase();
      this.filteredUsuarios = this.usuarios.filter(usuario =>
        usuario.nombre.toLowerCase().includes(q) ||
        usuario.correo.toLowerCase().includes(q) ||
        (usuario.codigoEstudiantil && usuario.codigoEstudiantil.toLowerCase().includes(q))
      );
    }
  }

  selectUsuario(usuario: UsuarioDTO): void {
    this.usuarioSelected.emit(usuario);
  }

  closeModal(): void {
    this.showModal = false;
    this.modalClosed.emit();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchUsuarios();
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
