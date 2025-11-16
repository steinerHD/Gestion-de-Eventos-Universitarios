import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { notyf } from '../app';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-in.html',
  styleUrls: ['./sign-in.css']
})
export class SignInComponent {
  loginForm: FormGroup;
  showActivationModal: boolean = false;
  currentUser: any = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    const allowedEmailPattern = /^[^\s@]+@uao\.edu\.co$/i;

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern(allowedEmailPattern)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).pipe(
        switchMap(() => this.authService.getUserProfile())
      ).subscribe({
        next: (user) => {
          this.currentUser = user;
          
          // Verificar si es secretaria inactiva
          if (user.tipoUsuario === 'Secretaria' && user.activa === false) {
            this.showActivationModal = true;
          } else {
            this.router.navigate(['/home']);
          }
        },
        error: () => notyf.error('Error al iniciar sesión. Verifica tus credenciales.')
      });
    }
  }

  activarSecretaria() {
    if (this.currentUser && this.currentUser.idSecretaria) {
      this.authService.activarSecretaria(this.currentUser.idSecretaria).subscribe({
        next: () => {
          notyf.success('Tu cuenta ha sido activada correctamente.');
          this.showActivationModal = false;
          this.router.navigate(['/home']);
        },
        error: () => {
          notyf.error('Error al activar la cuenta. Intenta de nuevo.');
        }
      });
    }
  }

  cerrarModal() {
    this.showActivationModal = false;
    this.authService.logout();
    this.router.navigate(['/signin']);
  }
}