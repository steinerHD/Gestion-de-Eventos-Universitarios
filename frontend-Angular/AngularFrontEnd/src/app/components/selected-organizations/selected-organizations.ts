import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExternalOrganization } from '../../services/organization.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-selected-organizations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './selected-organizations.html',
  styleUrls: ['./selected-organizations.css']
})
export class SelectedOrganizationsComponent {
  @Input() selectedOrganizations: ExternalOrganization[] = [];
  @Output() organizationRemoved = new EventEmitter<ExternalOrganization>();

  // Propiedades para cada organización
  organizationData: { [key: string]: { 
    participaRepresentante: boolean, 
    nombreRepresentante: string, 
    cedulaRepresentante: string,
    avalFile: File | null,
    avalFileName: string
  }} = {};

  removeOrganization(organization: ExternalOrganization): void {
    this.organizationRemoved.emit(organization);
  }

  onParticipationChange(organization: ExternalOrganization, event: Event): void {
    const target = event.target as HTMLInputElement;
    const orgId = organization.id;
    
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

  onAvalFileSelected(organization: ExternalOrganization, event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    const orgId = organization.id;
    
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

  removeAvalFile(organization: ExternalOrganization): void {
    const orgId = organization.id;
    if (this.organizationData[orgId]) {
      this.organizationData[orgId].avalFile = null;
      this.organizationData[orgId].avalFileName = '';
    }
  }

  getOrganizationData(organization: ExternalOrganization) {
    const orgId = organization.id;
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

