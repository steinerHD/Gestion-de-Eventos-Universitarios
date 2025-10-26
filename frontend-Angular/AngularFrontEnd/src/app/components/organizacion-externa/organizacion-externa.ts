import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrganizacionesApiService, OrganizacionExternaDTO } from '../../services/organizaciones.api.service';
import { OrganizationDetailsComponent } from '../organization-details/organization-details';
import { NuevaOrgaExtComponent } from '../../nueva-orga-ext/nueva-orga-ext';

@Component({
  selector: 'app-organizacion-externa',
  standalone: true,
  imports: [CommonModule, FormsModule, OrganizationDetailsComponent, NuevaOrgaExtComponent],
  templateUrl: './organizacion-externa.html',
  styleUrls: ['./organizacion-externa.css']
})
export class OrganizacionExternaComponent implements OnInit {
  @Input() showModal: boolean = false;
  @Output() modalClosed = new EventEmitter<void>();
  @Output() organizationSelected = new EventEmitter<OrganizacionExternaDTO>();

  organizations: OrganizacionExternaDTO[] = [];
  filteredOrganizations: OrganizacionExternaDTO[] = [];
  searchQuery: string = '';
  showDetailsModal: boolean = false;
  showNewOrgModal: boolean = false;
  selectedOrganization: OrganizacionExternaDTO | null = null;

  constructor(
    private organizacionesApi: OrganizacionesApiService
  ) {}

  ngOnInit(): void {
    this.loadOrganizations();
  }

  loadOrganizations(): void {
    this.organizacionesApi.getAll().subscribe({
      next: (orgs) => {
        this.organizations = orgs;
        this.filteredOrganizations = orgs;
      },
      error: (error) => console.error('Error al cargar organizaciones:', error)
    });
  }

  searchOrganizations(): void {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      this.filteredOrganizations = this.organizations;
    } else {
      const q = this.searchQuery.toLowerCase();
      this.filteredOrganizations = this.organizations.filter(org =>
        org.nombre.toLowerCase().includes(q) ||
        org.nit.toLowerCase().includes(q)
      );
    }
  }

  selectOrganization(organization: OrganizacionExternaDTO): void {
    // Emitir la organización seleccionada y cerrar el modal
    this.organizationSelected.emit(organization);
    this.closeModal();
  }


  closeModal(): void {
    this.showModal = false;
    this.modalClosed.emit();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchOrganizations();
  }

  viewOrganizationDetails(organization: OrganizacionExternaDTO): void {
    this.selectedOrganization = organization;
    this.showDetailsModal = true;
  }

  onOrganizationUpdated(updatedOrg: OrganizacionExternaDTO): void {
    // Actualizar la organización en la lista
    const index = this.organizations.findIndex(org => org.idOrganizacion === updatedOrg.idOrganizacion);
    if (index !== -1) {
      this.organizations[index] = updatedOrg;
      this.filteredOrganizations = [...this.organizations];
    }
  }

  onOrganizationDeleted(organizationId: number): void {
    // Remover la organización de la lista
    this.organizations = this.organizations.filter(org => org.idOrganizacion !== organizationId);
    this.filteredOrganizations = this.filteredOrganizations.filter(org => org.idOrganizacion !== organizationId);
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedOrganization = null;
  }

  addNewOrganization(): void {
    this.showNewOrgModal = true;
  }

  closeNewOrgModal(): void {
    this.showNewOrgModal = false;
  }

  onNewOrganizationCreated(newOrg: OrganizacionExternaDTO): void {
    this.loadOrganizations(); // Recargamos la lista para incluir la nueva organización
    this.closeNewOrgModal();
  }
}