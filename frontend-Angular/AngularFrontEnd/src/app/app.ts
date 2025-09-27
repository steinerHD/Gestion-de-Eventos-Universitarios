import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterOutlet } from '@angular/router'; 
import { OrganizacionExternaComponent } from './organizacion-externa/organizacion-externa';
import { Avales } from './avales/avales';
import { first } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule, OrganizacionExternaComponent, Avales],
  templateUrl: './app.html',
  styleUrl: './app.css'
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('AngularFrontEnd');
}


export class AppComponent {
  title = 'Gestión de Eventos Universitarios';
  selectedMenu: 'signin' | 'signup' | 'forgetpassword' | 'menu' | 'addevent' = 'signin';

  signInForm: FormGroup;
  signUpForm: FormGroup;
  forgetpasswordForm: FormGroup;

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

  // Señal para gestionar el estado de la ventana emergente.
  isModalOpen = signal(false);


  openModal(): void {
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
}
}



