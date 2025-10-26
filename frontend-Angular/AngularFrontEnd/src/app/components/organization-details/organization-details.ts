import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrganizacionesApiService, OrganizacionExternaDTO } from '../../services/organizaciones.api.service';
import { AuthApiService } from '../../services/auth-api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-organization-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './organization-details.html',
  styleUrls: ['./organization-details.css']
})
export class OrganizationDetailsComponent implements OnInit, OnChanges {
  @Input() organization: OrganizacionExternaDTO | null = null;
  @Input() showModal: boolean = false;
  @Output() modalClosed = new EventEmitter<void>();
  @Output() organizationUpdated = new EventEmitter<OrganizacionExternaDTO>();
  @Output() organizationDeleted = new EventEmitter<number>();

  organizationForm: FormGroup;
  isEditing: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  currentOrganizacionId: any;
  currentUser: any;

  constructor(
    private fb: FormBuilder,
    private organizacionesApi: OrganizacionesApiService,
    private authService: AuthService
  ) {
    this.organizationForm = this.fb.group({
      nombre: ['', Validators.required],
      nit: ['', Validators.required],
      ubicacion: ['', Validators.required],
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
      this.organizacionesApi.getByNit(this.organization.nit).subscribe(org => {
        this.currentOrganizacionId = org.id;
      })    
      this.authService.getUserProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        console.log('👤 Usuario logueado actual:', this.currentUser);
      },
      error: (error) => {
        console.error('❌ Error al obtener usuario logueado:', error);
      }
    })
    }
  }

  private loadOrganizationData(): void {
    if (this.organization) {
      this.organizationForm.patchValue({
        nombre: this.organization.nombre,
        nit: this.organization.nit,
        ubicacion: this.organization.ubicacion || '',
        representanteLegal: this.organization.representanteLegal || '',
        telefono: this.organization.telefono || '',
        sectorEconomico: this.organization.sectorEconomico || '',
        actividadPrincipal: this.organization.actividadPrincipal || ''
      });
    
    }
  }

  private checkPermissions(): void {
    // Backend aún no define id_creador en DTO; permitir edición por ahora
    this.canEdit = true;
    this.canDelete = true;
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.loadOrganizationData(); // Reset form if canceling edit
    }
  }

  saveChanges(): void {
    // Obtenemos el ID de forma segura, ya que puede venir como 'id' o 'idOrganizacion'
    const organizationId = this.organization?.idOrganizacion || (this.organization as any)?.id;

    if (this.organizationForm.valid && organizationId) {
      const updatedData: OrganizacionExternaDTO = {
        nit: this.organizationForm.value.nit,
        nombre: this.organizationForm.value.nombre,
        representanteLegal: this.organizationForm.value.representanteLegal,
        telefono: this.organizationForm.value.telefono,
        ubicacion: this.organizationForm.value.ubicacion,
        sectorEconomico: this.organizationForm.value.sectorEconomico,
        actividadPrincipal: this.organizationForm.value.actividadPrincipal,
        idCreador: this.currentUser.idUsuario
      };

      const id = this.currentOrganizacionId;
      const idUsuario = this.currentUser.idUsuario;
      this.organizacionesApi.update(id, updatedData, idUsuario).subscribe({
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
          console.log(updatedData)
        }
      });
    } else {
      this.organizationForm.markAllAsTouched();
    }
  }

  deleteOrganization(): void {
    const id = this.currentOrganizacionId;
    const idUsuario = this.currentUser.idUsuario;

    if (id && confirm('¿Estás seguro de que quieres eliminar esta organización?')) {
      this.organizacionesApi.delete(id, idUsuario).subscribe({
        next: (success) => {
          this.organizationDeleted.emit(id);
          this.closeModal();
          alert('Organización eliminada exitosamente');
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
