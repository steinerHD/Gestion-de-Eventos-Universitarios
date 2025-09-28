import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ProfileMenu } from './components/profile-menu/profile-menu';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterOutlet, ProfileMenu],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'Gestión de Eventos Universitarios';
  selectedMenu: 'signin' | 'signup' | 'forgetpassword' | 'menu'= 'signin';

  signInForm: FormGroup;
  signUpForm: FormGroup;
  forgetpasswordForm: FormGroup;
  showProfileMenu = false;

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }


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

    this.forgetpasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
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
      this.selectedMenu = 'menu';
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

  sendpwd() {
    alert('La contraseña fue enviada a tu correo institucional.');
  }
}

