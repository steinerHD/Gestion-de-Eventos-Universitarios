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

export interface EventoInstalacionDTO {
  idInstalacion: number;
  nombreInstalacion?: string;
  tipoInstalacion?: string;
  capacidadInstalacion?: number;
  horaInicio: string; // formato HH:mm:ss
  horaFin: string; // formato HH:mm:ss
}

export interface EventoOrganizadorRequest {
  idUsuario: number;
  avalPdf: string;
  tipoAval: 'Director_Programa' | 'Director_Docencia';
  rol: string;
}

export interface EventoOrganizadorResponse {
  idUsuario: number;
  avalPdf: string;
  tipoAval: string;
  rol: string;
}

export interface EventoDTO {
  idEvento?: number; // opcional para actualización

  // Datos principales
  titulo: string;
  tipoEvento: 'Académico' | 'Lúdico';
  fecha: string; // formato yyyy-MM-dd
  capacidad?: number; // capacidad del evento

  // Relaciones
  idOrganizador: number; // ID del usuario organizador
  instalaciones: EventoInstalacionDTO[]; // Instalaciones con horarios
  coorganizadores?: number[]; // IDs de coorganizadores
  organizadores?: EventoOrganizadorResponse[]; // Organizadores con aval individual (respuesta del backend)

  // Participaciones con organizaciones externas
  participacionesOrganizaciones?: ParticipacionDetalleDTO[];

  // Estado del evento
  estado: 'Aprobado' | 'Rechazado' | 'Pendiente' | 'Borrador';
  
  // Fecha de creación del evento (para filtrado de secretarias)
  fechaCreacion?: string;
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

  /**
   * Upload an aval PDF and return the path to be stored in the Evento. 
   * Backend returns { path: 'assets/uploads/avales/xxxx.pdf' }
   */
  uploadAval(file: File): Observable<{ path: string, filename?: string }> {
    const fd = new FormData();
    fd.append('file', file, file.name);
    return this.http.post<{ path: string, filename?: string }>(buildApiUrl('/api/avales'), fd);
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
  
  getEventosPorPeriodosActivacion(idSecretaria: number): Observable<EventoDTO[]> {
    return this.http.get<EventoDTO[]>(`${this.baseUrl}/secretaria/${idSecretaria}/periodos`);
  }
}


