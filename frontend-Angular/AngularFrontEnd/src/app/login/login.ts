import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  title = 'Gestión de Eventos Universitarios';
  selectedMenu: 'signin' | 'signup' | 'forgetpassword' | 'addevent' | 'menu' = 'signin';

  signInForm: FormGroup;
  signUpForm: FormGroup;
  forgetPasswordForm: FormGroup;

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

    } else {
      this.signInForm.markAllAsTouched();
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


}


