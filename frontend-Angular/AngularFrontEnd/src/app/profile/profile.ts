import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UsuariosApiService } from '../services/usuarios.api.service';
import { notyf } from '../app';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isEditing = false;
  currentUser: any = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private usuariosApiService: UsuariosApiService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      idUsuario: [null],
      nombre: ['', Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      tipoUsuario: [{ value: '', disabled: true }],
      codigoEstudiantil: [{ value: '', disabled: true }],
      programa: [''],
      unidadAcademica: [''],
      cargo: [''],
      facultad: ['']
    });
  }

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe({
      next: (user) => {
        if (user) {
          this.currentUser = user;
          this.profileForm.patchValue(user);
          this.updateFormBasedOnUserType(user.tipoUsuario);
        } else {
          this.router.navigate(['/signin']);
        }
      },
      error: () => {
        this.router.navigate(['/signin']);
      }
    });
  }

  updateFormBasedOnUserType(userType: string): void {
    // Lógica para mostrar/ocultar campos según el tipo de usuario
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      // Habilitar campos editables
      this.profileForm.get('nombre')?.enable();
      this.profileForm.get('programa')?.enable();
      this.profileForm.get('unidadAcademica')?.enable();
      this.profileForm.get('cargo')?.enable();
      this.profileForm.get('facultad')?.enable();
    } else {
      this.saveProfile();
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    // Recargar datos originales
    this.profileForm.patchValue(this.currentUser);
    this.profileForm.disable();
    this.profileForm.get('email')?.disable();
    this.profileForm.get('codigoEstudiantil')?.disable();
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      notyf.error('Por favor, complete los campos obligatorios.');
      return;
    }

    // Obtener solo los valores de los campos habilitados
    const updatedProfileData = this.profileForm.getRawValue();

    // Medida de seguridad: eliminar campos que no deben ser modificables
    delete updatedProfileData.email;
    delete updatedProfileData.codigoEstudiantil;
    delete updatedProfileData.tipoUsuario;

    this.usuariosApiService.update(this.currentUser.idUsuario, updatedProfileData).subscribe({
      next: (updatedUser: any) => {
        notyf.success('Perfil actualizado correctamente.');
        this.currentUser = { ...this.currentUser, ...updatedUser };
        this.authService.updateUserProfile(this.currentUser); // Actualizar en el servicio de autenticación
        this.isEditing = false;
        this.profileForm.patchValue(this.currentUser);
      },
      error: (err: any) => {
        notyf.error('Error al actualizar el perfil.');
        console.error('Error updating profile:', err);
      }
    });
  }
}