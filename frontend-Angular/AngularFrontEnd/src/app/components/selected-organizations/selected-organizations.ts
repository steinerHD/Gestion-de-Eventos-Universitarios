import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrganizacionExternaDTO } from '../../services/organizaciones.api.service';
import { DOCUMENT } from '@angular/common';
import { EventosApiService } from '../../services/eventos.api.service';
import { notyf } from '../../app';

@Component({
  selector: 'app-selected-organizations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './selected-organizations.html',
  styleUrls: ['./selected-organizations.css']
})
export class SelectedOrganizationsComponent implements OnInit, OnChanges {
  @Input() selectedOrganizations: OrganizacionExternaDTO[] = [];
  // Optional initial data provided by the parent (useful when editing an existing event)
  @Input() initialOrganizationData: { [key: string]: { 
    participaRepresentante?: boolean, 
    nombreRepresentante?: string, 
    cedulaRepresentante?: string,
    avalFilePath?: string,
    avalFileName?: string
  }} | null = null;
  @Output() organizationRemoved = new EventEmitter<OrganizacionExternaDTO>();

  // Propiedades para cada organización
  organizationData: { [key: string]: { 
    participaRepresentante: boolean, 
    nombreRepresentante: string, 
    cedulaRepresentante: string,
    avalFilePath: string,
    avalFileName: string
  }} = {};

  constructor(private eventosApi: EventosApiService) {}

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedOrganizations']) {
      console.log('🔄 SelectedOrganizationsComponent - selectedOrganizations changed:', this.selectedOrganizations);
      
      // Cuando se agregan nuevas organizaciones, aplicar datos iniciales si existen
      if (this.initialOrganizationData && this.selectedOrganizations) {
        this.selectedOrganizations.forEach(org => {
          const orgId = String(org.idOrganizacion || (org as any).id);
          const initialData = this.initialOrganizationData?.[orgId];
          
          if (initialData && !this.organizationData[orgId]) {
            this.organizationData[orgId] = {
              participaRepresentante: initialData.participaRepresentante ?? false,
              nombreRepresentante: initialData.nombreRepresentante ?? '',
              cedulaRepresentante: initialData.cedulaRepresentante ?? '',
              avalFilePath: initialData.avalFilePath ?? '',
              avalFileName: initialData.avalFileName ?? ''
            };
            console.log('✅ Datos iniciales aplicados para org', orgId, ':', this.organizationData[orgId]);
          }
        });
      }
    }
    
    // También aplicar datos iniciales cuando initialOrganizationData cambia
    if (changes['initialOrganizationData'] && this.initialOrganizationData) {
      console.log('🔄 SelectedOrganizationsComponent - initialOrganizationData changed:', this.initialOrganizationData);
      for (const [orgId, data] of Object.entries(this.initialOrganizationData)) {
        if (!this.organizationData[orgId]) {
          this.organizationData[orgId] = {
            participaRepresentante: false,
            nombreRepresentante: '',
            cedulaRepresentante: '',
            avalFilePath: '',
            avalFileName: ''
          };
        }
        // Only overwrite fields that are present in the provided initial data
        if (data.participaRepresentante !== undefined) this.organizationData[orgId].participaRepresentante = data.participaRepresentante;
        if (data.nombreRepresentante !== undefined) this.organizationData[orgId].nombreRepresentante = data.nombreRepresentante;
        if (data.cedulaRepresentante !== undefined) this.organizationData[orgId].cedulaRepresentante = data.cedulaRepresentante;
        if (data.avalFilePath !== undefined) this.organizationData[orgId].avalFilePath = data.avalFilePath;
        if (data.avalFileName !== undefined) this.organizationData[orgId].avalFileName = data.avalFileName;
        console.log('✅ Datos iniciales aplicados para org', orgId, ':', this.organizationData[orgId]);
      }
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
    
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        notyf.error('Por favor, selecciona un archivo PDF.');
        if (target) target.value = ''; // Limpiar el input para permitir seleccionar el mismo archivo (corregido) después.
        return;
      }
      
      if (!this.organizationData[orgId]) {
        this.organizationData[orgId] = {
          participaRepresentante: false,
          nombreRepresentante: '',
          cedulaRepresentante: '',
          avalFilePath: '',
          avalFileName: ''
        };
      }
      
      // Subir el archivo al backend usando el mismo endpoint que el aval del evento
      this.eventosApi.uploadAval(file).subscribe({
        next: (resp) => {
          // resp.path debería ser 'assets/uploads/avales/<file>'
          this.organizationData[orgId].avalFilePath = resp.path;
          this.organizationData[orgId].avalFileName = resp.filename || file.name;
          console.log('[INFO] Aval de organización subido:', resp);
        },
        error: (err) => {
          console.error('Error subiendo aval de organización:', err);
          if (!(err && (err as any)._notyfHandled)) {
            notyf.error('Error al subir el aval de la organización. Revisa la consola.');
          }
        }
      });
    } else {
      // client-side validation - always show this
      // No file was selected, or the selection was cancelled.
      // No action needed.
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
