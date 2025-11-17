import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { buildApiUrl, API_PATHS } from '../config/api.config';

export interface OrganizacionExternaDTO {
  id?: number; // El backend devuelve "id", no "idOrganizacion"
  idOrganizacion?: number; // Alias para compatibilidad
  nit: string;
  nombre: string;
  representanteLegal: string;
  telefono: string;
  ubicacion: string;
  sectorEconomico: string;
  actividadPrincipal: string;
  idCreador: number;
}

export interface OrganizacionExternaResponse {
  id: number;
  nit:string;
  nombre: string;
  representanteLegal: string;
  telefono: string;
  ubicacion: string;
  sectorEconomico: string;
  actividadPrincipal: string;
  idCreador: number;
}

@Injectable({ providedIn: 'root' })
export class OrganizacionesApiService {
  private readonly baseUrl = buildApiUrl(API_PATHS.organizacionesExternas);

  constructor(private http: HttpClient) {}

  getAll(): Observable<OrganizacionExternaDTO[]> {
    return this.http.get<OrganizacionExternaDTO[]>(this.baseUrl);
  }

  getById(id: number): Observable<OrganizacionExternaDTO> {
    return this.http.get<OrganizacionExternaDTO>(`${this.baseUrl}/${id}`);
  }

  getByNit(nit: string): Observable<OrganizacionExternaResponse> {
    return this.http.get<OrganizacionExternaResponse>(`${this.baseUrl}/nit/${encodeURIComponent(nit)}`);
  }

  searchByNombre(nombre: string): Observable<OrganizacionExternaDTO[]> {
    return this.http.get<OrganizacionExternaDTO[]>(`${this.baseUrl}/nombre/${encodeURIComponent(nombre)}`);
  }

  searchByRepresentante(representante: string): Observable<OrganizacionExternaDTO[]> {
    return this.http.get<OrganizacionExternaDTO[]>(`${this.baseUrl}/representante/${encodeURIComponent(representante)}`);
  }

  searchByUbicacion(ubicacion: string): Observable<OrganizacionExternaDTO[]> {
    return this.http.get<OrganizacionExternaDTO[]>(`${this.baseUrl}/ubicacion/${encodeURIComponent(ubicacion)}`);
  }

  searchBySectorEconomico(sector: string): Observable<OrganizacionExternaDTO[]> {
    return this.http.get<OrganizacionExternaDTO[]>(`${this.baseUrl}/sector-economico/${encodeURIComponent(sector)}`);
  }

  create(payload: OrganizacionExternaDTO): Observable<OrganizacionExternaDTO> {
    console.log('Datos :3', payload);
    return this.http.post<OrganizacionExternaDTO>(this.baseUrl, payload);
  }

  update(id: number, payload: OrganizacionExternaDTO, idUsuario: number): Observable<OrganizacionExternaDTO> {
    return this.http.put<OrganizacionExternaDTO>(`${this.baseUrl}/${id}?idUsuario=${idUsuario}`, payload);
  }

  delete(id: number, idUsuario: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}?idUsuario=${idUsuario}`);
  }
}


