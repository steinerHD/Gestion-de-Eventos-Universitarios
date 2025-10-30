import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrganizacionesApiService, OrganizacionExternaDTO } from '../../services/organizaciones.api.service';
import { OrganizationDetailsComponent } from '../organization-details/organization-details';
import { NuevaOrgaExtComponent } from '../../nueva-orga-ext/nueva-orga-ext';
import { notyf } from '../../app';


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
        if (this.searchQuery && this.searchQuery.trim() !== '') {
          this.searchOrganizations();
        }
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
    // Para evitar inconsistencias/duplicados, recargar desde el servidor
    this.loadOrganizations();
    this.closeDetailsModal();
  }

  onOrganizationDeleted(organizationId: number): void {
    // Recargamos la lista desde el servidor para reflejar la eliminación
    this.loadOrganizations();
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedOrganization = null;
    // Asegurar datos consistentes al cerrar el modal
    this.loadOrganizations();
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