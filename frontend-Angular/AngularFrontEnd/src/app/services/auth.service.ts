import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;
  private userData = {
    nombre: 'Pepito Alberto Diaz Castillo',
    tipoUsuario: 'Estudiante',
    rolCuenta: 'Estudiante',
    email: 'Pepito@U.edu.co',
    facultad: 'Ingeniería',
    codigoEstudiantil: 'I0000000'
  };

  login(email: string, password: string): Observable<{ success: boolean }> {
    if (email === 'test@example.com' && password === 'password123') {
      this.loggedIn = true;
      return of({ success: true });
    } else {
      return throwError(() => new Error('Credenciales inválidas'));
    }
  }

  isLoggedIn(): Observable<boolean> {
    return of(this.loggedIn);
  }

  logout(): void {
    this.loggedIn = false;
    console.log('User logged out');
  }

  getUserProfile(): Observable<any> {
    return this.loggedIn ? of(this.userData) : throwError(() => new Error('No user logged in'));
  }

  updateUserProfile(userData: any): Observable<any> {
    this.userData = { ...this.userData, ...userData };
    return of(this.userData);
  }

  resetPassword(email: string): Observable<{ success: boolean }> {
  return of({ success: true }); // Mock; replace with real API call
  }
}