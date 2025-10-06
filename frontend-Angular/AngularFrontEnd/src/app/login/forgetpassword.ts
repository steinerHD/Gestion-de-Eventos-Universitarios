import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service'; // Updated path
import { AuthApiService } from '../services/auth-api.service'; // Import AuthApiService
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgetpassword',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgetpassword.html',
  styleUrls: ['./forgetpassword.css']
})
export class ForgetPasswordComponent {
  forgetPasswordForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private authApiService: AuthApiService) {
    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  sendPwd() {
    if (this.forgetPasswordForm.valid) {
      console.log('Recuperación de contraseña enviada a:', this.forgetPasswordForm.value.email);
      this.authApiService.recuperarContrasena(this.forgetPasswordForm.value.email).subscribe({
        next: (response) => {
          console.log('Respuesta del servidor:', response);
        },
        error: (error) => {
          console.error('Error al enviar la solicitud:', error);
        }
      });
    }
  }
}