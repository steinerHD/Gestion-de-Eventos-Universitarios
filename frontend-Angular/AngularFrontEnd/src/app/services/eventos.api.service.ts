import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { buildApiUrl, API_PATHS } from '../config/api.config';

export interface InstalacionRef {
  idInstalacion: number;
  nombre: string;
  tipo?: string;
  ubicacion?: string;
  capacidad?: number;
}

export interface EventoDTO {
  idEvento?: number;
  titulo: string;
  tipoEvento: 'Académico' | 'Lúdico';
  fecha: string; // yyyy-MM-dd
  horaInicio: string; // HH:mm:ss
  horaFin: string; // HH:mm:ss
  instalaciones?: { idInstalacion: number }[]; // estructura simplificada según JSON especificado
  organizador?: { idUsuario: number }; // estructura según JSON especificado
  avalPdf?: string; // Base64 string
  tipoAval?: 'Director_Programa' | 'Director_Docencia';
}

@Injectable({ providedIn: 'root' })
export class EventosApiService {
  private readonly baseUrl = buildApiUrl(API_PATHS.eventos);

  constructor(private http: HttpClient) {}

  getAll(): Observable<EventoDTO[]> {
    return this.http.get<EventoDTO[]>(this.baseUrl);
  }

  getById(id: number): Observable<EventoDTO> {
    return this.http.get<EventoDTO>(`${this.baseUrl}/${id}`);
  }

  getByInstalacion(idInstalacion: number): Observable<EventoDTO[]> {
    return this.http.get<EventoDTO[]>(`${this.baseUrl}/instalacion/${idInstalacion}`);
  }

  getByTitulo(titulo: string): Observable<EventoDTO[]> {
    return this.http.get<EventoDTO[]>(`${this.baseUrl}/titulo/${encodeURIComponent(titulo)}`);
  }

  getFuturos(fechaISO: string): Observable<EventoDTO[]> {
    const params = new HttpParams().set('fecha', fechaISO);
    return this.http.get<EventoDTO[]>(`${this.baseUrl}/futuros`, { params });
  }

  create(evento: EventoDTO): Observable<EventoDTO> {
    return this.http.post<EventoDTO>(this.baseUrl, evento);
  }

  update(id: number, evento: EventoDTO): Observable<EventoDTO> {
    return this.http.put<EventoDTO>(`${this.baseUrl}/${id}`, evento);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}


