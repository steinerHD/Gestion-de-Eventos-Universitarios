import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { buildApiUrl, API_PATHS } from '../config/api.config';

export interface ParticipacionOrganizacion {
  idEvento: number;
  idOrganizacion: number;
  certificadoPdf: string; // Base64 string
  representanteDiferente?: boolean;
  nombreRepresentanteDiferente?: string;
}

export interface ParticipacionOrganizacionCreateDTO {
  idEvento: number;
  idOrganizacion: number;
  certificadoPdf: string; // Base64 string
  representanteDiferente?: boolean;
  nombreRepresentanteDiferente?: string;
}

@Injectable({ providedIn: 'root' })
export class ParticipacionesOrganizacionesApiService {
  private readonly baseUrl = buildApiUrl('/api/participaciones-organizaciones');

  constructor(private http: HttpClient) {}

  getAll(): Observable<ParticipacionOrganizacion[]> {
    return this.http.get<ParticipacionOrganizacion[]>(this.baseUrl);
  }

  getById(idEvento: number, idOrganizacion: number): Observable<ParticipacionOrganizacion> {
    return this.http.get<ParticipacionOrganizacion>(`${this.baseUrl}/evento/${idEvento}/organizacion/${idOrganizacion}`);
  }

  getByEvento(idEvento: number): Observable<ParticipacionOrganizacion[]> {
    return this.http.get<ParticipacionOrganizacion[]>(`${this.baseUrl}/evento/${idEvento}`);
  }

  getByOrganizacion(idOrganizacion: number): Observable<ParticipacionOrganizacion[]> {
    return this.http.get<ParticipacionOrganizacion[]>(`${this.baseUrl}/organizacion/${idOrganizacion}`);
  }

  getConRepresentanteDiferente(): Observable<ParticipacionOrganizacion[]> {
    return this.http.get<ParticipacionOrganizacion[]>(`${this.baseUrl}/representante-diferente`);
  }

  create(participacion: ParticipacionOrganizacionCreateDTO): Observable<ParticipacionOrganizacion> {
    return this.http.post<ParticipacionOrganizacion>(this.baseUrl, participacion);
  }

  update(idEvento: number, idOrganizacion: number, participacion: ParticipacionOrganizacion): Observable<ParticipacionOrganizacion> {
    return this.http.put<ParticipacionOrganizacion>(`${this.baseUrl}/evento/${idEvento}/organizacion/${idOrganizacion}`, participacion);
  }

  delete(idEvento: number, idOrganizacion: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/evento/${idEvento}/organizacion/${idOrganizacion}`);
  }
}
