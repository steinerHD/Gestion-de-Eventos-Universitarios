import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service'; // Adjust path based on location

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isEditing = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.profileForm = this.fb.group({
      nombre: ['', Validators.required],
      tipoUsuario: ['', Validators.required],
      rolCuenta: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      facultad: ['', Validators.required],
      codigoEstudiantil: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.authService.getUserProfile().subscribe({
      next: (data) => {
        this.profileForm.patchValue(data);
        console.log('Datos del usuario cargados:', data);
      },
      error: (error) => console.error('Error al cargar datos:', error)
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.profileForm.valid) {
      this.authService.updateUserProfile(this.profileForm.value).subscribe({
        next: (data) => {
          this.profileForm.patchValue(data);
          console.log('Cambios guardados:', data);
        },
        error: (error) => console.error('Error al guardar cambios:', error)
      });
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.loadUserData(); // Reset form to original data
  }
  
}