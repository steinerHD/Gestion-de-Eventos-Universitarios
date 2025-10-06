import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, map, tap, of, throwError, forkJoin } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthApiService, JwtResponse, LoginRequest, UserRequest, EstudianteRequest, DocenteRequest, SecretariaAcademicaRequest } from './auth-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'auth_token';
  private isLoggedInSubject = new BehaviorSubject<boolean>(!!localStorage.getItem(this.tokenKey));

  constructor(private authApi: AuthApiService) {}

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isLoggedInSubject.next(false);
  }

  login(email: string, password: string): Observable<void> {
    const payload: LoginRequest = { correo: email, contrasenaHash: password };
    return this.authApi.login(payload).pipe(
      tap((res: JwtResponse) => {
        localStorage.setItem(this.tokenKey, res.token);
        localStorage.setItem('current_email', email);
        this.isLoggedInSubject.next(true);
      }),
      map(() => void 0)
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private decodeJwtEmail(token: string | null): string | null {
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      // pad base64 to length multiple of 4
      while (base64.length % 4 !== 0) base64 += '=';
      const decoded = JSON.parse(atob(base64));
      // Spring JwtService uses correo as subject
      return decoded.sub || decoded.correo || null;
    } catch {
      return null;
    }
  }

  registrarUsuario(nombre: string, correo: string, contrasena: string): Observable<any> {
    const payload: UserRequest = { nombre, correo, contrasenaHash: contrasena };
    return this.authApi.registrarUsuario(payload);
  }

  registrarEstudiante(idUsuario: number, codigoEstudiantil: string, programa: string): Observable<any> {
    const payload: EstudianteRequest = { idUsuario, codigoEstudiantil, programa };
    return this.authApi.registrarEstudiante(payload);
  }

  registrarDocente(idUsuario: number, unidadAcademica: string, cargo: string): Observable<any> {
    const payload: DocenteRequest = { idUsuario, unidadAcademica, cargo };
    return this.authApi.registrarDocente(payload);
  }

  registrarSecretaria(idUsuario: number, facultad: string): Observable<any> {
    const payload: SecretariaAcademicaRequest = { idUsuario, facultad };
    return this.authApi.registrarSecretaria(payload);
  }

  // Pre-validations
  existsUsuarioPorCorreo(correo: string): Observable<boolean> {
    return this.authApi.existsUsuarioPorCorreo(correo);
  }

  existsEstudiantePorCodigo(codigoEstudiantil: string): Observable<boolean> {
    return this.authApi.existsEstudiantePorCodigo(codigoEstudiantil);
  }

  // Obtener perfil combinado desde el backend según rol
  getUserProfile(): Observable<any> {
    const correo = this.decodeJwtEmail(this.getToken()) || localStorage.getItem('current_email');
    if (!correo) return throwError(() => new Error('No user logged in'));

    return this.authApi.getUsuarioPorCorreo(correo).pipe(
      switchMap((usuario: any) => {
        const idUsuario = usuario?.idUsuario ?? usuario?.id;
        if (!idUsuario) return throwError(() => new Error('Usuario sin id'));

        return forkJoin({
          estudiante: this.authApi.getEstudiantePorUsuario(idUsuario).pipe(catchError(() => of(null))),
          docente: this.authApi.getDocentePorUsuario(idUsuario).pipe(catchError(() => of(null))),
          secretaria: this.authApi.getSecretariaPorUsuario(idUsuario).pipe(catchError(() => of(null)))
        }).pipe(
          map(({ estudiante, docente, secretaria }) => {
            let tipoUsuario = 'Usuario';
            const perfil: any = {};

            if (estudiante) {
              tipoUsuario = 'Estudiante';
              perfil.codigoEstudiantil = estudiante.codigoEstudiantil;
              perfil.programa = estudiante.programa;
            } else if (docente) {
              tipoUsuario = 'Docente';
              perfil.unidadAcademica = docente.unidadAcademica;
              perfil.cargo = docente.cargo;
            } else if (secretaria) {
              tipoUsuario = 'Secretaria';
              perfil.facultad = secretaria.facultad;
            }

            return {
              idUsuario,
              nombre: usuario.nombre,
              email: usuario.correo,
              tipoUsuario,
              ...perfil
            };
          })
        );
      })
    );
  }

  updateUserProfile(userData: any): Observable<any> {
    localStorage.setItem('user_profile', JSON.stringify(userData));
    return of(userData);
  }

  resetPassword(email: string): Observable<{ success: boolean }> {
    // Placeholder to keep existing flows working; integrate backend if needed
    return of({ success: true });
  }
}