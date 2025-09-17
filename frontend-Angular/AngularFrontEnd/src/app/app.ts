import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'Gestión de Eventos Universitarios';
  selectedMenu: 'signin' | 'signup' | 'forgetpassword' = 'signin';

  signInForm: FormGroup;
  signUpForm: FormGroup;

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
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      return { passwordsMismatch: true };
    }
    return null;
  }

  onSignIn() {
    if (this.signInForm.valid) {
      alert('Iniciando sesión...');
      console.log('Iniciar sesión', this.signInForm.value);
    } else {
      this.signInForm.markAllAsTouched();
      this.signInForm.markAsDirty();
    }
  }

  onSignUp() {
    if (this.signUpForm.valid) {
      alert('Creando cuenta...');
      console.log('Crear cuenta', this.signUpForm.value);
    } else {
      this.signUpForm.markAllAsTouched();
      this.signUpForm.markAsDirty();
    }
  }
}
