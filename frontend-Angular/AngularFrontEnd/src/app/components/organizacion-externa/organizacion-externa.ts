import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrganizationService, ExternalOrganization } from '../../services/organization.service';

@Component({
  selector: 'app-organizacion-externa',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  constructor(private organizationService: OrganizationService) {}

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
}