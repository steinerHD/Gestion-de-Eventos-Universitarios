import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ExternalOrganization {
  id: string;
  name: string;
  nit: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private organizations: ExternalOrganization[] = [
    {
      id: '1',
      name: 'Universidad Operativa de Colombia',
      nit: '12231341424151'
    },
    {
      id: '2',
      name: 'Mercá',
      nit: '12231341734151'
    },
    {
      id: '3',
      name: 'BVVA',
      nit: '13333331734151'
    },
    {
      id: '4',
      name: 'DismeyLand',
      nit: '13338461254151'
    },
    {
      id: '5',
      name: 'Plan padrinos',
      nit: '13333327455151'
    },
    {
      id: '6',
      name: 'Ministerio de la seriedad',
      nit: '13323987455151'
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
}
