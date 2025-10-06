import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrganizacionExternaDTO } from '../../services/organizaciones.api.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-selected-organizations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './selected-organizations.html',
  styleUrls: ['./selected-organizations.css']
})
export class SelectedOrganizationsComponent {
  @Input() selectedOrganizations: OrganizacionExternaDTO[] = [];
  @Output() organizationRemoved = new EventEmitter<OrganizacionExternaDTO>();

  // Propiedades para cada organización
  organizationData: { [key: string]: { 
    participaRepresentante: boolean, 
    nombreRepresentante: string, 
    cedulaRepresentante: string,
    avalFile: File | null,
    avalFileName: string
  }} = {};

  removeOrganization(organization: OrganizacionExternaDTO): void {
    this.organizationRemoved.emit(organization);
  }

  onParticipationChange(organization: OrganizacionExternaDTO, event: Event): void {
    const target = event.target as HTMLInputElement;
    const orgId = String(organization.idOrganizacion);
    
    if (!this.organizationData[orgId]) {
      this.organizationData[orgId] = {
        participaRepresentante: false,
        nombreRepresentante: '',
        cedulaRepresentante: '',
        avalFile: null,
        avalFileName: ''
      };
    }
    
    this.organizationData[orgId].participaRepresentante = target.checked;
  }

  onAvalFileSelected(organization: OrganizacionExternaDTO, event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    const orgId = String(organization.idOrganizacion);
    
    if (file && file.type === 'application/pdf') {
      if (!this.organizationData[orgId]) {
        this.organizationData[orgId] = {
          participaRepresentante: false,
          nombreRepresentante: '',
          cedulaRepresentante: '',
          avalFile: null,
          avalFileName: ''
        };
      }
      
      this.organizationData[orgId].avalFile = file;
      this.organizationData[orgId].avalFileName = file.name;
    } else {
      alert('Por favor selecciona un archivo PDF válido.');
    }
  }

  removeAvalFile(organization: OrganizacionExternaDTO): void {
    const orgId = String(organization.idOrganizacion);
    if (this.organizationData[orgId]) {
      this.organizationData[orgId].avalFile = null;
      this.organizationData[orgId].avalFileName = '';
    }
  }

  getOrganizationData(organization: OrganizacionExternaDTO) {
    const orgId = String(organization.idOrganizacion);
    if (!this.organizationData[orgId]) {
      this.organizationData[orgId] = {
        participaRepresentante: false,
        nombreRepresentante: '',
        cedulaRepresentante: '',
        avalFile: null,
        avalFileName: ''
      };
    }
    return this.organizationData[orgId];
  }
}

