import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { EventService } from '../services/event.service';
import { EventosApiService, EventoDTO } from '../services/eventos.api.service';
import { OrganizacionExternaDTO } from '../services/organizaciones.api.service';
import { UsuarioDTO } from '../services/usuarios.api.service';
import { ParticipacionesOrganizacionesApiService, ParticipacionOrganizacionCreateDTO } from '../services/participaciones-organizaciones.api.service';
import { OrganizacionExternaComponent } from '../components/organizacion-externa/organizacion-externa';
import { SelectedOrganizationsComponent } from '../components/selected-organizations/selected-organizations';
import { UsuarioSelectionComponent } from '../components/usuario-selection/usuario-selection';
import { SelectedUsersComponent } from '../components/selected-users/selected-users';
import { EncountersComponent, Encounter } from '../components/encounters/encounters';

@Component({
  selector: 'app-add-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, OrganizacionExternaComponent, SelectedOrganizationsComponent, UsuarioSelectionComponent, SelectedUsersComponent, EncountersComponent],
  templateUrl: './add-event.html',
  styleUrls: ['./add-event.css']
})
export class AddEventComponent {
  eventForm: FormGroup;
  showOrgModal: boolean = false;
  showUserModal: boolean = false;
  selectedOrganizations: OrganizacionExternaDTO[] = [];
  selectedUsers: UsuarioDTO[] = [];
  encounters: Encounter[] = [];
  selectedFile: File | null = null;
  organizationCertificates: Map<number, string> = new Map(); // Map<idOrganizacion, certificadoBase64>
  
  constructor(
    private fb: FormBuilder, 
    private eventService: EventService, 
    private eventosApiService: EventosApiService,
    private participacionesApiService: ParticipacionesOrganizacionesApiService,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      eventName: ['', Validators.required],
      eventLocation: [''],
      eventType: ['', Validators.required],
      eventStatus: ['Borrador', Validators.required],
      externalOrgName: [''],
      externalOrgNit: [''],
      externalOrgParticipation: [false],
      // Campos para el backend
      avalPdf: ['', Validators.required],
      tipoAval: ['', Validators.required]
    });
  }

  submitEvent(): void {
    console.log('=== VALIDACIÓN DEL FORMULARIO DE EVENTO ===');
    console.log('📋 Estado del formulario:', this.eventForm.value);
    console.log('📋 Formulario válido:', this.eventForm.valid);
    console.log('📋 Encuentros:', this.encounters);
    console.log('📋 Usuarios seleccionados:', this.selectedUsers);
    console.log('📋 Organizaciones seleccionadas:', this.selectedOrganizations);
    
    const formErrors = this.validateForm();
    if (formErrors.length > 0) {
      console.error('❌ Errores en el formulario:', formErrors);
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    if (this.encounters.length === 0) {
      alert('El evento debe tener al menos un encuentro.');
      return;
    }

    if (this.selectedUsers.length === 0) {
      alert('El evento debe tener al menos un organizador.');
      return;
    }

    // Validar certificados de organizaciones si participan
    if (this.eventForm.get('externalOrgParticipation')?.value && this.selectedOrganizations.length > 0) {
      const missingCertificates = this.validateOrganizationCertificates();
      if (missingCertificates.length > 0) {
        alert(`Faltan certificados para las siguientes organizaciones: ${missingCertificates.join(', ')}`);
        return;
      }
    }

    const eventoData: EventoDTO = this.buildEventoDTO();
    
    console.log('📤 Enviando evento al backend:', eventoData);

    this.eventosApiService.create(eventoData).subscribe({
      next: (createdEvent) => {
        console.log('✅ Evento creado exitosamente:', createdEvent);
        
        // Si hay organizaciones seleccionadas y participan, crear las participaciones
        if (this.eventForm.get('externalOrgParticipation')?.value && 
            this.selectedOrganizations.length > 0 && 
            createdEvent.idEvento) {
          
          this.createOrganizationParticipations(createdEvent.idEvento);
        } else {
          alert('Evento creado exitosamente.');
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        console.error('❌ Error al crear evento:', error);
        alert('Error al crear el evento. Verifique la consola para más detalles.');
      }
    });
  }

  private validateForm(): string[] {
    const errors: string[] = [];
    const form = this.eventForm;

    if (!form.get('eventName')?.value?.trim()) errors.push('El título del evento es obligatorio');
    if (!form.get('eventType')?.value) errors.push('El tipo de evento es obligatorio');
    if (!form.get('avalPdf')?.value?.trim()) errors.push('El aval PDF es obligatorio');
    if (!form.get('tipoAval')?.value) errors.push('El tipo de aval es obligatorio');

    if (this.encounters.length === 0) {
      errors.push('El evento debe tener al menos un encuentro');
    } else {
      this.encounters.forEach((encounter, index) => {
        if (!encounter.date) errors.push(`El encuentro ${index + 1} debe tener una fecha`);
        if (!encounter.startTime) errors.push(`El encuentro ${index + 1} debe tener una hora de inicio`);
        if (!encounter.endTime) errors.push(`El encuentro ${index + 1} debe tener una hora de fin`);
        if (!encounter.location) errors.push(`El encuentro ${index + 1} debe tener una instalación`);
      });
    }

    return errors;
  }

  private buildEventoDTO(): EventoDTO {
  const form = this.eventForm;
  const primerEncuentro = this.encounters[0];
  const formatHora = (hora: string) => hora && hora.length === 5 ? hora + ':00' : hora;

  // Solo los IDs de instalaciones
  const instalaciones = this.encounters
    .filter(enc => enc.location?.idInstalacion !== undefined)
    .map(enc => ({
      idInstalacion: enc.location!.idInstalacion
    }));

  // Solo los IDs de organizaciones externas
  const organizacionesExternas = this.selectedOrganizations
    .filter(org => org.idOrganizacion !== undefined)
    .map(org => ({
      idOrganizacion: org.idOrganizacion!
    }));

  const organizador = this.selectedUsers[0];

  console.log('🏢 Instalaciones:', instalaciones);
  console.log('🏢 Organizaciones externas (IDs):', organizacionesExternas);

  const eventoData: EventoDTO = {
    titulo: form.get('eventName')?.value,
    tipoEvento: form.get('eventType')?.value === 'academico' ? 'Académico' : 'Lúdico',
    fecha: primerEncuentro?.date || '',
    horaInicio: formatHora(primerEncuentro?.startTime) || '',
    horaFin: formatHora(primerEncuentro?.endTime) || '',
    instalaciones: instalaciones,
    organizacionesExternas: organizacionesExternas,
    organizador: { idUsuario: organizador.idUsuario },
    avalPdf: form.get('avalPdf')?.value,
    tipoAval: form.get('tipoAval')?.value
  };

  console.log('📤 EventoDTO construido (final):', eventoData);
  return eventoData;
}

  cancel(): void {
    this.eventForm.reset();
    this.router.navigate(['/home']);
  }

  openModal(): void {
    this.showOrgModal = true;
  }

  closeOrgModal(): void {
    this.showOrgModal = false;
  }

  openUserModal(): void {
    this.showUserModal = true;
  }

  closeUserModal(): void {
    this.showUserModal = false;
  }

  onOrganizationSelected(organization: OrganizacionExternaDTO): void {
    const exists = this.selectedOrganizations.some(org => org.idOrganizacion === organization.idOrganizacion);
    if (!exists) {
      this.selectedOrganizations.push(organization);
      this.updateFormWithSelectedOrganizations();
    }
  }

  onOrganizationRemoved(organization: OrganizacionExternaDTO): void {
    this.selectedOrganizations = this.selectedOrganizations.filter(org => org.idOrganizacion !== organization.idOrganizacion);
    this.updateFormWithSelectedOrganizations();
  }

  private updateFormWithSelectedOrganizations(): void {
    if (this.selectedOrganizations.length > 0) {
      const firstOrg = this.selectedOrganizations[0];
      this.eventForm.patchValue({
        externalOrgName: firstOrg.nombre,
        externalOrgNit: firstOrg.nit,
        externalOrgParticipation: true
      });
    } else {
      this.eventForm.patchValue({
        externalOrgName: '',
        externalOrgNit: '',
        externalOrgParticipation: false
      });
    }
  }

  onParticipationChange(): void {
    const participation = this.eventForm.get('externalOrgParticipation')?.value;
    if (!participation) {
      this.selectedOrganizations = [];
      this.eventForm.patchValue({
        externalOrgName: '',
        externalOrgNit: ''
      });
    }
  }

  onUserSelected(user: UsuarioDTO): void {
    const exists = this.selectedUsers.some(u => u.idUsuario === user.idUsuario);
    if (!exists) this.selectedUsers.push(user);
  }

  onUserRemoved(user: UsuarioDTO): void {
    this.selectedUsers = this.selectedUsers.filter(u => u.idUsuario !== user.idUsuario);
  }

  onEncountersChanged(encounters: Encounter[]): void {
    this.encounters = encounters;
  }

  isFormValid(): boolean {
    const formValid = this.eventForm.valid;
    const hasEncounters = this.encounters.length > 0;
    const hasOrganizers = this.selectedUsers.length > 0;
    const encountersValid = this.encounters.every(e => e.date && e.startTime && e.endTime && e.location);

    return formValid && hasEncounters && hasOrganizers && encountersValid;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1] || base64String;
        this.eventForm.patchValue({ avalPdf: base64Data });
      };
      reader.readAsDataURL(file);
    } else {
      this.selectedFile = null;
      this.eventForm.patchValue({ avalPdf: '' });
    }
  }

  onOrganizationCertificateSelected(event: { organizationId: number, certificateBase64: string }): void {
    this.organizationCertificates.set(event.organizationId, event.certificateBase64);
    console.log(`Certificado cargado para organización ${event.organizationId}`);
  }

  private validateOrganizationCertificates(): string[] {
    const missingCertificates: string[] = [];
    
    for (const organization of this.selectedOrganizations) {
      if (organization.idOrganizacion && !this.organizationCertificates.has(organization.idOrganizacion)) {
        missingCertificates.push(organization.nombre || `ID: ${organization.idOrganizacion}`);
      }
    }
    
    return missingCertificates;
  }

  private createOrganizationParticipations(eventId: number): void {
    const participationsToCreate: ParticipacionOrganizacionCreateDTO[] = [];
    
    for (const organization of this.selectedOrganizations) {
      if (organization.idOrganizacion && this.organizationCertificates.has(organization.idOrganizacion)) {
        const certificado = this.organizationCertificates.get(organization.idOrganizacion);
        if (certificado) {
          participationsToCreate.push({
            idEvento: eventId,
            idOrganizacion: organization.idOrganizacion,
            certificadoPdf: certificado,
            representanteDiferente: false // Por defecto, se puede modificar después
          });
        }
      }
    }

    if (participationsToCreate.length === 0) {
      alert('Evento creado exitosamente.');
      this.router.navigate(['/home']);
      return;
    }

    // Crear participaciones una por una
    let completedCount = 0;
    let hasErrors = false;

    for (const participation of participationsToCreate) {
      this.participacionesApiService.create(participation).subscribe({
        next: (createdParticipation) => {
          console.log('✅ Participación creada:', createdParticipation);
          completedCount++;
          
          if (completedCount === participationsToCreate.length) {
            if (!hasErrors) {
              alert('Evento y participaciones de organizaciones creados exitosamente.');
              this.router.navigate(['/home']);
            }
          }
        },
        error: (error) => {
          console.error('❌ Error al crear participación:', error);
          hasErrors = true;
          completedCount++;
          
          if (completedCount === participationsToCreate.length) {
            alert('Evento creado, pero hubo errores al crear algunas participaciones de organizaciones.');
            this.router.navigate(['/home']);
          }
        }
      });
    }
  }

  getOrganizationCertificateFileName(organizationId: number): string {
    return this.organizationCertificates.has(organizationId) ? 'Certificado cargado ✓' : 'Sin certificado';
  }
}
