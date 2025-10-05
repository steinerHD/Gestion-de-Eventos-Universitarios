import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrganizationService, ExternalOrganization } from '../../services/organization.service';
import { OrganizationDetailsComponent } from '../organization-details/organization-details';

@Component({
  selector: 'app-organizacion-externa',
  standalone: true,
  imports: [CommonModule, FormsModule, OrganizationDetailsComponent],
  templateUrl: './organizacion-externa.html',
  styleUrls: ['./organizacion-externa.css']
})
export class OrganizacionExternaComponent implements OnInit {
  @Input() showModal: boolean = false;
  @Output() modalClosed = new EventEmitter<void>();
  @Output() organizationSelected = new EventEmitter<ExternalOrganization>();

  organizations: ExternalOrganization[] = [];
  filteredOrganizations: ExternalOrganization[] = [];
  searchQuery: string = '';
  selectedOrganizations: ExternalOrganization[] = [];
  showDetailsModal: boolean = false;
  selectedOrganization: ExternalOrganization | null = null;

  constructor(
    private organizationService: OrganizationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrganizations();
  }

  loadOrganizations(): void {
    this.organizationService.getOrganizations().subscribe({
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
      this.organizationService.searchOrganizations(this.searchQuery).subscribe({
        next: (orgs) => {
          this.filteredOrganizations = orgs;
        },
        error: (error) => console.error('Error al buscar organizaciones:', error)
      });
    }
  }

  selectOrganization(organization: ExternalOrganization): void {
    // Verificar si ya está seleccionada
    const isAlreadySelected = this.selectedOrganizations.some(org => org.id === organization.id);
    
    if (!isAlreadySelected) {
      this.selectedOrganizations.push(organization);
      this.organizationSelected.emit(organization);
    }
  }

  removeSelectedOrganization(organization: ExternalOrganization): void {
    this.selectedOrganizations = this.selectedOrganizations.filter(org => org.id !== organization.id);
  }

  closeModal(): void {
    this.showModal = false;
    this.modalClosed.emit();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchOrganizations();
  }

  viewOrganizationDetails(organization: ExternalOrganization): void {
    this.selectedOrganization = organization;
    this.showDetailsModal = true;
  }

  onOrganizationUpdated(updatedOrg: ExternalOrganization): void {
    // Actualizar la organización en la lista
    const index = this.organizations.findIndex(org => org.id === updatedOrg.id);
    if (index !== -1) {
      this.organizations[index] = updatedOrg;
      this.filteredOrganizations = [...this.organizations];
    }
  }

  onOrganizationDeleted(organizationId: string): void {
    // Remover la organización de la lista
    this.organizations = this.organizations.filter(org => org.id !== organizationId);
    this.filteredOrganizations = this.filteredOrganizations.filter(org => org.id !== organizationId);
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedOrganization = null;
  }

  addNewOrganization(): void {
    this.router.navigate(['/new-organ-ext']);
  }
}