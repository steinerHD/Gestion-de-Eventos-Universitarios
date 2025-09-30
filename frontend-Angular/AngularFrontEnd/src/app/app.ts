import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AvalesComponent } from './components/avales/avales';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AvalesComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'Gestión de Eventos Universitarios';
  selectedMenu: 'signin' | 'signup' | 'forgetpassword' | 'addevent' | 'menu' = 'signin';

  signInForm: FormGroup;
  signUpForm: FormGroup;
  forgetPasswordForm: FormGroup;

  // Señal para manejar modal
  isModalOpen = signal(false);

  constructor(private fb: FormBuilder) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.signUpForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      faculty: ['', [Validators.required]],
      academicUnit: ['', [Validators.required]],
      userType: ['', [Validators.required]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9]).+$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });

    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  private passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  onSignIn() {
    if (this.signInForm.valid) {
      alert('Iniciando sesión...');
      console.log('Iniciar sesión', this.signInForm.value);
      this.selectedMenu = 'menu';
    } else {
      this.signInForm.markAllAsTouched();
    }
  }

  onSignUp() {
    if (this.signUpForm.valid) {
      alert('Creando cuenta...');
      console.log('Crear cuenta', this.signUpForm.value);
      this.selectedMenu = 'signin';
    } else {
      this.signUpForm.markAllAsTouched();
    }
  }

  sendPwd() {
    if (this.forgetPasswordForm.valid) {
      alert('La contraseña fue enviada a tu correo institucional.');
      this.selectedMenu = 'signin';
    } else {
      this.forgetPasswordForm.markAllAsTouched();
    }
  }

  openModal(): void {
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }
}
