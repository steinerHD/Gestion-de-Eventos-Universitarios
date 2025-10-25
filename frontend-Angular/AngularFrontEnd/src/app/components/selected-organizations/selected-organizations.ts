import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
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
export class SelectedOrganizationsComponent implements OnInit, OnChanges {
  @Input() selectedOrganizations: OrganizacionExternaDTO[] = [];
  @Output() organizationRemoved = new EventEmitter<OrganizacionExternaDTO>();

  // Propiedades para cada organización
  organizationData: { [key: string]: { 
    participaRepresentante: boolean, 
    nombreRepresentante: string, 
    cedulaRepresentante: string,
    avalFilePath: string,
    avalFileName: string
  }} = {};

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedOrganizations']) {
      console.log('🔄 SelectedOrganizationsComponent - selectedOrganizations changed:', this.selectedOrganizations);
    }
  }

  removeOrganization(organization: OrganizacionExternaDTO): void {
    this.organizationRemoved.emit(organization);
  }

  onParticipationChange(organization: OrganizacionExternaDTO, event: Event): void {
    const target = event.target as HTMLInputElement;
    const orgId = String(organization.idOrganizacion || (organization as any).id);
    
    if (!this.organizationData[orgId]) {
      this.organizationData[orgId] = {
        participaRepresentante: false,
        nombreRepresentante: '',
        cedulaRepresentante: '',
        avalFilePath: '',
        avalFileName: ''
      };
    }
    
    this.organizationData[orgId].participaRepresentante = target.checked;
    
    // Si no participa el representante, limpiar el nombre
    if (!target.checked) {
      this.organizationData[orgId].nombreRepresentante = '';
    }
  }

  onAvalFileSelected(organization: OrganizacionExternaDTO, event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    const orgId = String(organization.idOrganizacion || (organization as any).id);
    
    if (file && file.type === 'application/pdf') {
      if (!this.organizationData[orgId]) {
        this.organizationData[orgId] = {
          participaRepresentante: false,
          nombreRepresentante: '',
          cedulaRepresentante: '',
          avalFilePath: '',
          avalFileName: ''
        };
      }
      
      // Para un proyecto de prueba, solo guardamos la ruta del archivo
      this.organizationData[orgId].avalFilePath = `uploads/avales/org_${orgId}_${Date.now()}.pdf`;
      this.organizationData[orgId].avalFileName = file.name;
    } else {
      alert('Por favor selecciona un archivo PDF válido.');
    }
  }

  removeAvalFile(organization: OrganizacionExternaDTO): void {
    const orgId = String(organization.idOrganizacion || (organization as any).id);
    if (this.organizationData[orgId]) {
      this.organizationData[orgId].avalFilePath = '';
      this.organizationData[orgId].avalFileName = '';
    }
  }

  getOrganizationData(organization: OrganizacionExternaDTO) {
    // Usar la misma lógica de ID que en add-event
    const orgId = String(organization.idOrganizacion || (organization as any).id);
    
    if (!this.organizationData[orgId]) {
      this.organizationData[orgId] = {
        participaRepresentante: false,
        nombreRepresentante: '',
        cedulaRepresentante: '',
        avalFilePath: '',
        avalFileName: ''
      };
    }
    return this.organizationData[orgId];
  }

  // Método para obtener todos los datos de las organizaciones seleccionadas
  getAllOrganizationData() {
    return this.organizationData;
  }

  // Método para obtener los datos de una organización específica
  getOrganizationDataById(orgId: number) {
    const orgIdStr = String(orgId);
    return this.organizationData[orgIdStr] || {
      participaRepresentante: false,
      nombreRepresentante: '',
      cedulaRepresentante: '',
      avalFilePath: '',
      avalFileName: ''
    };
  }
}

