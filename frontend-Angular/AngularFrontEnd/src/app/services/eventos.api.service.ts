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

export interface OrganizacionExternaRef {
  idOrganizacion: number;
  nombre?: string;
  nit?: string;
}

export interface ParticipacionDetalleDTO {
  idOrganizacion: number;
  nombreOrganizacion?: string; // Nombre de la organización
  certificadoPdf: string; 
  representanteDiferente?: boolean; // Por defecto false
  nombreRepresentanteDiferente?: string; // Solo si representanteDiferente = true
}

export interface EventoDTO {
  idEvento?: number; // opcional para actualización

  // Datos principales
  titulo: string;
  tipoEvento: 'Académico' | 'Lúdico';
  fecha: string; // formato yyyy-MM-dd
  horaInicio: string; // formato HH:mm:ss
  horaFin: string; // formato HH:mm:ss

  // Relaciones
  idOrganizador: number; // ID del usuario organizador
  instalaciones: number[]; // IDs de instalaciones
  coorganizadores?: number[]; // IDs de coorganizadores

  // Participaciones con organizaciones externas
  participacionesOrganizaciones?: ParticipacionDetalleDTO[];

  // Aval
  avalPdf?: string; // PDF del aval
  tipoAval?: 'Director_Programa' | 'Director_Docencia';

  // Estado del evento
  estado: 'Aprobado' | 'Rechazado' | 'Pendiente' | 'Borrador';
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

  getByOrganizador(idOrganizador: number): Observable<EventoDTO[]> {
    return this.http.get<EventoDTO[]>(`${this.baseUrl}/organizador/${idOrganizador}`);
  }

  sendToValidation(idEvento: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${idEvento}/enviar-validacion`, {});
  }

  approve(idEvento: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${idEvento}/aprobar`, {});
  }

  reject(idEvento: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${idEvento}/rechazar`, {});
  }
}


