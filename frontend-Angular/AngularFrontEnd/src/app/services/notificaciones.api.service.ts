import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

export interface NotificacionResponse {
  idNotificacion: number;
  idEvaluacion?: number;
  idUsuario: number;
  nombreUsuario?: string;
  mensaje: string;
  leida: boolean;
  tipoNotificacion?: string;
  fechaEnvio: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificacionesApiService {
  private baseUrl = `${API_BASE_URL}/api/notificaciones`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<NotificacionResponse[]> {
    return this.http.get<NotificacionResponse[]>(this.baseUrl);
  }

  getById(id: number): Observable<NotificacionResponse> {
    return this.http.get<NotificacionResponse>(`${this.baseUrl}/${id}`);
  }

  getByUsuario(idUsuario: number): Observable<NotificacionResponse[]> {
    return this.http.get<NotificacionResponse[]>(`${this.baseUrl}/usuario/${idUsuario}`);
  }

  getNoLeidasByUsuario(idUsuario: number): Observable<NotificacionResponse[]> {
    return this.http.get<NotificacionResponse[]>(`${this.baseUrl}/usuario/${idUsuario}/no-leidas`);
  }

  marcarComoLeida(id: number): Observable<NotificacionResponse> {
    return this.http.put<NotificacionResponse>(`${this.baseUrl}/${id}/marcar-leida`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
