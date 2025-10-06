import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { buildApiUrl, API_PATHS } from '../config/api.config';

export interface InstalacionDTO {
  idInstalacion: number;
  nombre: string;
  tipo: string;
  ubicacion: string;
  capacidad: number;
}

@Injectable({ providedIn: 'root' })
export class InstalacionesApiService {
  private readonly baseUrl = buildApiUrl(API_PATHS.instalaciones);

  constructor(private http: HttpClient) {}

  getAll(): Observable<InstalacionDTO[]> {
    return this.http.get<InstalacionDTO[]>(this.baseUrl);
  }

  getById(idInstalacion: number): Observable<InstalacionDTO> {
    return this.http.get<InstalacionDTO>(`${this.baseUrl}/${idInstalacion}`);
  }

  getByTipo(tipo: string): Observable<InstalacionDTO[]> {
    return this.http.get<InstalacionDTO[]>(`${this.baseUrl}/tipo/${encodeURIComponent(tipo)}`);
  }

  getByCapacidadMinima(capacidad: number): Observable<InstalacionDTO[]> {
    return this.http.get<InstalacionDTO[]>(`${this.baseUrl}/capacidad/${capacidad}`);
  }

  getByNombre(nombre: string): Observable<InstalacionDTO[]> {
    return this.http.get<InstalacionDTO[]>(`${this.baseUrl}/nombre/${encodeURIComponent(nombre)}`);
  }

  getByUbicacion(ubicacion: string): Observable<InstalacionDTO[]> {
    return this.http.get<InstalacionDTO[]>(`${this.baseUrl}/ubicacion/${encodeURIComponent(ubicacion)}`);
  }
}


