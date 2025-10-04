import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service'; // Adjust path based on location
import { FormsModule } from '@angular/forms'; // For ngModel (if needed for editing)

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule], // Add FormsModule for editing
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  userData: any = {
    nombre: 'Pepito Alberto Diaz Castillo',
    tipoUsuario: 'Estudiante',
    rolCuenta: 'Estudiante',
    email: 'Pepito@U.edu.co',
    facultad: 'Ingeniería',
    codigoEstudiantil: 'I0000000'
  };
  isEditing = false; // Track edit mode

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Fetch real user data from AuthService or API
    this.loadUserData();
  }

  loadUserData(): void {
    // Placeholder: Replace with real AuthService call
    // Example: this.authService.getUserProfile().subscribe(data => this.userData = data);
    console.log('Cargando datos del usuario:', this.userData);
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Save changes (placeholder)
      console.log('Guardando cambios:', this.userData);
      // Example: this.authService.updateUserProfile(this.userData).subscribe();
    }
  }
}