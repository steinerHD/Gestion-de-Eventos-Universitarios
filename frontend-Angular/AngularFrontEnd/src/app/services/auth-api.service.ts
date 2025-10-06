import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { buildApiUrl, API_PATHS } from '../config/api.config';

export interface JwtResponse { token: string }

export interface LoginRequest {
  correo: string;
  contrasenaHash: string;
}

export interface UserRequest {
  nombre: string;
  correo: string;
  contrasenaHash: string;
}

export interface EstudianteRequest {
  idUsuario: number;
  codigoEstudiantil: string;
  programa: string;
}



export interface DocenteRequest {
  idUsuario: number;
  unidadAcademica: string;
  cargo: string;
}

export interface SecretariaAcademicaRequest {
  idUsuario: number;
  facultad: string;
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly baseUrl = buildApiUrl(API_PATHS.auth);
  private readonly usuariosUrl = buildApiUrl(API_PATHS.usuarios);
  private readonly estudiantesUrl = buildApiUrl(API_PATHS.estudiantes);
  private readonly docentesUrl = buildApiUrl(API_PATHS.docentes);
  private readonly secretariasUrl = buildApiUrl(API_PATHS.secretarias);

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.baseUrl}/login`, payload);
  }

  recuperarContrasena(correo: string): Observable<any> {
  
    return this.http.post<any>(`${this.baseUrl}/recuperar`, {'correo': correo});
  }

  registrarUsuario(payload: UserRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/registrar/usuario`, payload);
  }

  registrarEstudiante(payload: EstudianteRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/registrar/estudiante`, payload);
  }

  registrarDocente(payload: DocenteRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/registrar/docente`, payload);
  }

  registrarSecretaria(payload: SecretariaAcademicaRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/registrar/secretaria`, payload);
  }

  // Fetch base user by correo
  getUsuarioPorCorreo(correo: string): Observable<any> {
    return this.http.get<any>(`${this.usuariosUrl}/correo/${encodeURIComponent(correo)}`);
  }

  existsUsuarioPorCorreo(correo: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.usuariosUrl}/exists/correo/${encodeURIComponent(correo)}`);
  }

  // Fetch role-specific entities by user id
  getEstudiantePorUsuario(idUsuario: number): Observable<any> {
    return this.http.get<any>(`${this.estudiantesUrl}/usuario/${idUsuario}`);
  }

  existsEstudiantePorCodigo(codigo: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.estudiantesUrl}/exists/codigo/${encodeURIComponent(codigo)}`);
  }

  getDocentePorUsuario(idUsuario: number): Observable<any> {
    return this.http.get<any>(`${this.docentesUrl}/usuario/${idUsuario}`);
  }

  getSecretariaPorUsuario(idUsuario: number): Observable<any> {
    return this.http.get<any>(`${this.secretariasUrl}/usuario/${idUsuario}`);
  }
}


