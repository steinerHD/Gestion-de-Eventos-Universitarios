import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';   

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  template: `
    <div class="container mt-5">
      <div class="d-flex justify-content-center mb-4">
        <button class="btn btn-primary me-2" (click)="selectedMenu = 'signin'">Iniciar sesión</button>
        <button class="btn btn-success" (click)="selectedMenu = 'signup'">Registrate</button>
      </div>

      <!-- Sign In Form -->
      <div *ngIf="selectedMenu === 'signin'" class="card p-4 mx-auto" style="max-width: 400px;">
        <h3 class="mb-3 text-center">Inicio de sesión</h3>
        <form (ngSubmit)="onSignIn()">
          <div class="mb-3">
            <label for="signinEmail" class="form-label">Email address</label>
            <input type="email" class="form-control" id="signinEmail" placeholder="Enter email" [(ngModel)]="signInEmail" name="signInEmail">
          </div>
          <div class="mb-3">
            <label for="signinPassword" class="form-label">Password</label>
            <input type="password" class="form-control" id="signinPassword" placeholder="Password" [(ngModel)]="signInPassword" name="signInPassword">
          </div>
          <button type="submit" class="btn btn-primary w-100">Sign In</button>
        </form>
      </div>

      <!-- Sign Up Form -->
      <div *ngIf="selectedMenu === 'signup'" class="card p-4 mx-auto" style="max-width: 400px;">
        <h3 class="mb-3 text-center">Registro</h3>
        <form (ngSubmit)="onSignUp()">
          <div class="mb-3">
            <label for="signupName" class="form-label">Nombre Completo</label>
            <input type="text" class="form-control" id="signupName" placeholder="Escribe tu nombre completo" [(ngModel)]="signUpName" name="signUpName">
          </div>
          <div class="mb-3">
            <label for="signupEmail" class="form-label">Correo institucional</label>
            <input type="email" class="form-control" id="signupEmail" placeholder="Escribe tu correo institucional" [(ngModel)]="signUpEmail" name="signUpEmail">
          </div>
          <div class="mb-3">
            <label for="signupFaculty" class="form-label">Facultad</label>
            <input type="text" class="form-control" id="signupFaculty" placeholder="Escribe tu facultad" [(ngModel)]="signUpFaculty" name="signUpFaculty">
          </div>
          <div class="mb-3">
            <label for="signupAcademic" class="form-label">Unidad académica</label>
            <input type="text" class="form-control" id="signupAcademic" placeholder="Escribe tu unidad académica" [(ngModel)]="signUpAcademic" name="signUpAcademic">
          </div>
          <div class="mb-3">
            <label for="signupPassword" class="form-label">Contraseña</label>
            <input type="password" class="form-control" id="signupPassword" placeholder="Contraseña" [(ngModel)]="signUpPassword" name="signUpPassword">
          </div>
          <div class="mb-3">
            <label for="signupConfirmPassword" class="form-label">Confirma tu contraseña</label>
            <input type="password" class="form-control" id="signupConfirmPassword" placeholder="Escribe tu contraseña de nuevo" [(ngModel)]="signUpConfirmPassword" name="signUpConfirmPassword">
          </div>
          <button type="submit" class="btn btn-success w-100">Crear cuenta</button>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  selectedMenu: 'signin' | 'signup' = 'signin';
  
  // Sign In properties
  signInEmail: string = '';
  signInPassword: string = '';
  
  // Sign Up properties
  signUpName: string = '';
  signUpEmail: string = '';
  signUpFaculty: string = '';
  signUpAcademic: string = '';
  signUpPassword: string = '';
  signUpConfirmPassword: string = '';

  constructor(private router: Router) {}

  onSignIn() {
    // Aquí puedes agregar la lógica de autenticación
    console.log('Sign In:', { email: this.signInEmail, password: this.signInPassword });
    
    // Por ahora, simplemente navegamos al home
    this.router.navigate(['/home']);
  }

  onSignUp() {
    // Aquí puedes agregar la lógica de registro
    console.log('Sign Up:', {
      name: this.signUpName,
      email: this.signUpEmail,
      faculty: this.signUpFaculty,
      academic: this.signUpAcademic,
      password: this.signUpPassword,
      confirmPassword: this.signUpConfirmPassword
    });
    
    // Por ahora, simplemente navegamos al home
    this.router.navigate(['/home']);
  }
}

