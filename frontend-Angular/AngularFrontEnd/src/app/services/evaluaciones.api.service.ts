import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { buildApiUrl, API_PATHS } from '../config/api.config';

export interface EvaluacionRequest {
  fecha?: string; // ISO date string
  estado: 'Aprobado' | 'Rechazado';
  justificacion?: string;
  actaPdf?: string;
  idEvento: number;
  idSecretaria: number;
}

export interface EvaluacionResponse {
  idEvaluacion: number;
  fecha: string;
  estado: 'Aprobado' | 'Rechazado';
  justificacion?: string;
  actaPdf?: string;
  idEvento: number;
  idSecretaria: number;
}

@Injectable({ providedIn: 'root' })
export class EvaluacionesApiService {
  private readonly baseUrl = buildApiUrl('/api/evaluaciones');

  constructor(private http: HttpClient) {}

  getAll(): Observable<EvaluacionResponse[]> {
    return this.http.get<EvaluacionResponse[]>(this.baseUrl);
  }

  getById(id: number): Observable<EvaluacionResponse> {
    return this.http.get<EvaluacionResponse>(`${this.baseUrl}/${id}`);
  }

  getByEvento(idEvento: number): Observable<EvaluacionResponse[]> {
    return this.http.get<EvaluacionResponse[]>(`${this.baseUrl}/evento/${idEvento}`);
  }

  getBySecretaria(idSecretaria: number): Observable<EvaluacionResponse[]> {
    return this.http.get<EvaluacionResponse[]>(`${this.baseUrl}/secretaria/${idSecretaria}`);
  }

  create(request: EvaluacionRequest): Observable<EvaluacionResponse> {
    return this.http.post<EvaluacionResponse>(this.baseUrl, request);
  }

  update(id: number, request: EvaluacionRequest): Observable<EvaluacionResponse> {
    return this.http.put<EvaluacionResponse>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Upload acta PDF y retorna la ruta para almacenar
   */
  uploadActa(file: File): Observable<{ path: string, filename?: string }> {
    const fd = new FormData();
    fd.append('file', file, file.name);
    return this.http.post<{ path: string, filename?: string }>(buildApiUrl('/api/actas'), fd);
  }
}
