import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ExternalOrganization {
  id: string;
  name: string;
  nit: string;
  direccion?: string;
  representanteLegal?: string;
  telefono?: string;
  sectorEconomico?: string;
  actividadPrincipal?: string;
  id_creador?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private organizations: ExternalOrganization[] = [
    {
      id: '1',
      name: 'Universidad Operativa de Colombia',
      nit: '12231341424151',
      direccion: 'Calle 123 #45-67, Bogotá',
      representanteLegal: 'Dr. Carlos Mendoza Ruiz',
      telefono: '+57 1 234 5678',
      sectorEconomico: 'Educación Superior',
      actividadPrincipal: 'Formación académica y investigación universitaria',
      id_creador: '1'
    },
    {
      id: '2',
      name: 'Mercá',
      nit: '12231341734151',
      direccion: 'Avenida 68 #25-30, Medellín',
      representanteLegal: 'María Elena Vásquez',
      telefono: '+57 4 567 8901',
      sectorEconomico: 'Comercio',
      actividadPrincipal: 'Distribución y comercialización de productos alimenticios',
      id_creador: '1'
    },
    {
      id: '3',
      name: 'BVVA',
      nit: '13333331734151',
      direccion: 'Carrera 15 #93-47, Bogotá',
      representanteLegal: 'Roberto Silva Torres',
      telefono: '+57 1 345 6789',
      sectorEconomico: 'Servicios Financieros',
      actividadPrincipal: 'Servicios bancarios y financieros',
      id_creador: '2'
    },
    {
      id: '4',
      name: 'DismeyLand',
      nit: '13338461254151',
      direccion: 'Zona Rosa, Calle 82 #12-15, Bogotá',
      representanteLegal: 'Ana Lucía García',
      telefono: '+57 1 456 7890',
      sectorEconomico: 'Entretenimiento',
      actividadPrincipal: 'Parques temáticos y entretenimiento familiar',
      id_creador: '1'
    },
    {
      id: '5',
      name: 'Plan padrinos',
      nit: '13333327455151',
      direccion: 'Calle 100 #15-20, Bogotá',
      representanteLegal: 'Padre José María López',
      telefono: '+57 1 567 8901',
      sectorEconomico: 'Organización sin ánimo de lucro',
      actividadPrincipal: 'Programas de apoyo social y educativo para niños',
      id_creador: '3'
    },
    {
      id: '6',
      name: 'Ministerio de la seriedad',
      nit: '13323987455151',
      direccion: 'Carrera 8 #6-38, Bogotá',
      representanteLegal: 'Ministro Alejandro Ramírez',
      telefono: '+57 1 678 9012',
      sectorEconomico: 'Sector Público',
      actividadPrincipal: 'Administración pública y políticas gubernamentales',
      id_creador: '1'
    }
  ];

  getOrganizations(): Observable<ExternalOrganization[]> {
    return of(this.organizations);
  }

  searchOrganizations(query: string): Observable<ExternalOrganization[]> {
    if (!query || query.trim() === '') {
      return of(this.organizations);
    }
    const filteredOrganizations = this.organizations.filter(org => 
      org.name.toLowerCase().includes(query.toLowerCase()) ||
      org.nit.includes(query)
    );
    return of(filteredOrganizations);
  }

  getOrganizationById(id: string): Observable<ExternalOrganization | undefined> {
    const organization = this.organizations.find(org => org.id === id);
    return of(organization);
  }

  addOrganization(organization: Omit<ExternalOrganization, 'id'>): Observable<ExternalOrganization> {
    const newOrganization: ExternalOrganization = {
      id: (this.organizations.length + 1).toString(),
      ...organization
    };
    this.organizations.push(newOrganization);
    return of(newOrganization);
  }

  updateOrganization(id: string, organization: Partial<ExternalOrganization>): Observable<ExternalOrganization | undefined> {
    const index = this.organizations.findIndex(org => org.id === id);
    if (index !== -1) {
      this.organizations[index] = { ...this.organizations[index], ...organization };
      return of(this.organizations[index]);
    }
    return of(undefined);
  }

  deleteOrganization(id: string): Observable<boolean> {
    const index = this.organizations.findIndex(org => org.id === id);
    if (index !== -1) {
      this.organizations.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}
