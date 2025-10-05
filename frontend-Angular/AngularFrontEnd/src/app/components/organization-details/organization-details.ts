import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrganizationService, ExternalOrganization } from '../../services/organization.service';

@Component({
  selector: 'app-organization-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './organization-details.html',
  styleUrls: ['./organization-details.css']
})
export class OrganizationDetailsComponent implements OnInit, OnChanges {
  @Input() organization: ExternalOrganization | null = null;
  @Input() showModal: boolean = false;
  @Output() modalClosed = new EventEmitter<void>();
  @Output() organizationUpdated = new EventEmitter<ExternalOrganization>();
  @Output() organizationDeleted = new EventEmitter<string>();

  organizationForm: FormGroup;
  isEditing: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;

  constructor(
    private fb: FormBuilder,
    private organizationService: OrganizationService
  ) {
    this.organizationForm = this.fb.group({
      name: ['', Validators.required],
      nit: ['', Validators.required],
      direccion: ['', Validators.required],
      representanteLegal: ['', Validators.required],
      telefono: ['', Validators.required],
      sectorEconomico: ['', Validators.required],
      actividadPrincipal: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.organization) {
      this.loadOrganizationData();
      this.checkPermissions();
    }
  }

  ngOnChanges(): void {
    if (this.organization) {
      this.loadOrganizationData();
      this.checkPermissions();
    }
  }

  private loadOrganizationData(): void {
    if (this.organization) {
      this.organizationForm.patchValue({
        name: this.organization.name,
        nit: this.organization.nit,
        direccion: this.organization.direccion || '',
        representanteLegal: this.organization.representanteLegal || '',
        telefono: this.organization.telefono || '',
        sectorEconomico: this.organization.sectorEconomico || '',
        actividadPrincipal: this.organization.actividadPrincipal || ''
      });
    }
  }

  private checkPermissions(): void {
    const currentUserId = localStorage.getItem('currentUserId') || '1';
    this.canEdit = this.organization?.id_creador === currentUserId;
    this.canDelete = this.organization?.id_creador === currentUserId;
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.loadOrganizationData(); // Reset form if canceling edit
    }
  }

  saveChanges(): void {
    if (this.organizationForm.valid && this.organization) {
      const updatedData = this.organizationForm.value;
      
      this.organizationService.updateOrganization(this.organization.id, updatedData).subscribe({
        next: (updatedOrg) => {
          if (updatedOrg) {
            this.organization = updatedOrg;
            this.organizationUpdated.emit(updatedOrg);
            this.isEditing = false;
            alert('Organización actualizada exitosamente');
          }
        },
        error: (error) => {
          console.error('Error al actualizar organización:', error);
          alert('Error al actualizar la organización');
        }
      });
    } else {
      this.organizationForm.markAllAsTouched();
    }
  }

  deleteOrganization(): void {
    if (this.organization && confirm('¿Estás seguro de que quieres eliminar esta organización?')) {
      this.organizationService.deleteOrganization(this.organization.id).subscribe({
        next: (success) => {
          if (success) {
            this.organizationDeleted.emit(this.organization!.id);
            this.closeModal();
            alert('Organización eliminada exitosamente');
          }
        },
        error: (error) => {
          console.error('Error al eliminar organización:', error);
          alert('Error al eliminar la organización');
        }
      });
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.isEditing = false;
    this.modalClosed.emit();
  }
}
