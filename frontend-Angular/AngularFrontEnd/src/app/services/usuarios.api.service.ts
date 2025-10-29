import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { buildApiUrl, API_PATHS } from '../config/api.config';

export interface UsuarioDTO {
  idUsuario: number;
  nombre: string;
  correo: string;
  tipoUsuario: 'estudiante' | 'docente' | 'secretaria';
  codigoEstudiantil?: string;
  programa?: string;
  unidadAcademica?: string;
  cargo?: string;
  facultad?: string;
}

@Injectable({ providedIn: 'root' })
export class UsuariosApiService {
  private readonly baseUrl = buildApiUrl(API_PATHS.usuarios);

  constructor(private http: HttpClient) {}

  getAll(): Observable<UsuarioDTO[]> {
    return this.http.get<UsuarioDTO[]>(this.baseUrl);
  }

  getById(id: number): Observable<UsuarioDTO> {
    return this.http.get<UsuarioDTO>(`${this.baseUrl}/${id}`);
  }

  getEstudiantes(): Observable<UsuarioDTO[]> {
    return this.http.get<UsuarioDTO[]>(`${this.baseUrl}/estudiantes`);
  }

  getDocentes(): Observable<UsuarioDTO[]> {
    return this.http.get<UsuarioDTO[]>(`${this.baseUrl}/docentes`);
  }

  searchByNombre(nombre: string): Observable<UsuarioDTO[]> {
    return this.http.get<UsuarioDTO[]>(`${this.baseUrl}/nombre/${encodeURIComponent(nombre)}`);
  }

  searchByCorreo(correo: string): Observable<UsuarioDTO[]> {
    return this.http.get<UsuarioDTO[]>(`${this.baseUrl}/correo/${encodeURIComponent(correo)}`);
  }

  update(id: number, payload: Partial<UsuarioDTO>): Observable<UsuarioDTO> {
    return this.http.put<UsuarioDTO>(`${this.baseUrl}/${id}`, payload);
  }
}
