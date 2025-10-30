import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosApiService, UsuarioDTO } from '../../services/usuarios.api.service';
import { notyf } from '../../app';

@Component({
  selector: 'app-usuario-selection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-selection.html',
  styleUrls: ['./usuario-selection.css']
})
export class UsuarioSelectionComponent implements OnInit, OnChanges {
  @Input() showModal: boolean = false;
  @Input() currentUserId?: number; // ID del usuario logueado para excluirlo
  @Input() selectedUsuarios: UsuarioDTO[] = [];
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

  ngOnChanges(): void {
    // Recargar usuarios cuando cambie el currentUserId
    if (this.currentUserId !== undefined) {
      this.loadUsuarios();
    }
  }

  loadUsuarios(): void {
    console.log('🔄 Cargando usuarios... currentUserId:', this.currentUserId);
    this.usuariosApi.getAll().subscribe({
      next: (usuarios) => {
        console.log('📋 Todos los usuarios del sistema:', usuarios);
        console.log('👤 Usuario logueado a excluir (ID):', this.currentUserId);
        
        // Filtrar al usuario logueado y a usuarios con rol 'secretaria' (no pueden ser coorganizadores).
        // Algunos usuarios pueden venir con el rol indicado en `tipoUsuario` o con una propiedad anidada `secretaria`.
        this.usuarios = usuarios.filter(usuario => {
          const isLoggedUser = usuario.idUsuario === this.currentUserId;
          const isTipoSecretaria = (usuario as any).tipoUsuario === 'secretaria';
          const hasNestedSecretaria = (usuario as any).secretaria !== undefined;
          return !isLoggedUser && !isTipoSecretaria && !hasNestedSecretaria;
        });
        this.filteredUsuarios = this.usuarios;
        
        console.log('👥 Usuarios cargados (sin usuario logueado y sin secretarias):', this.usuarios);
        console.log('👥 Cantidad de usuarios disponibles:', this.usuarios.length);
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
    if (!this.isSelected(usuario)) {
      this.usuarioSelected.emit(usuario);
    }
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

  isSelected(usuario: UsuarioDTO): boolean {
    return this.selectedUsuarios?.some(u => u.idUsuario === usuario.idUsuario) || false;
  }
}
