import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { EventService } from '../services/event.service';
import { EventosApiService, EventoDTO } from '../services/eventos.api.service';
import { OrganizacionExternaDTO } from '../services/organizaciones.api.service';
import { UsuarioDTO } from '../services/usuarios.api.service';
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
  
  constructor(
    private fb: FormBuilder, 
    private eventService: EventService, 
    private eventosApiService: EventosApiService,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      eventName: ['', Validators.required],
      eventLocation: ['', Validators.required],
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
    console.log('📋 Errores del formulario:', this.eventForm.errors);
    console.log('📋 Encuentros:', this.encounters);
    console.log('📋 Usuarios seleccionados:', this.selectedUsers);
    
    // Validar campos del formulario
    const formErrors = this.validateForm();
    if (formErrors.length > 0) {
      console.error('❌ Errores en el formulario:', formErrors);
      formErrors.forEach(error => console.error(`- ${error}`));
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    // Validar encuentros
    if (this.encounters.length === 0) {
      console.error('❌ El evento debe tener al menos un encuentro.');
      alert('El evento debe tener al menos un encuentro.');
      return;
    }

    // Validar organizadores
    if (this.selectedUsers.length === 0) {
      console.error('❌ El evento debe tener al menos un organizador.');
      alert('El evento debe tener al menos un organizador.');
      return;
    }

    console.log('✅ Validaciones completadas exitosamente');

    // Crear el objeto EventoDTO para el backend
    const eventoData: EventoDTO = this.buildEventoDTO();
    
    console.log('📤 Enviando evento al backend:', eventoData);

    // Enviar al backend
    this.eventosApiService.create(eventoData).subscribe({
      next: (createdEvent) => {
        console.log('✅ Evento creado exitosamente:', createdEvent);
        alert('Evento creado exitosamente.');
        this.router.navigate(['/home']);
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

    // Validar campos básicos
    if (!form.get('eventName')?.value?.trim()) {
      errors.push('El título del evento es obligatorio');
    }

    if (!form.get('eventType')?.value) {
      errors.push('El tipo de evento es obligatorio');
    }

    if (!form.get('avalPdf')?.value || form.get('avalPdf')?.value.trim() === '') {
      errors.push('El aval PDF es obligatorio');
    }

    if (!form.get('tipoAval')?.value) {
      errors.push('El tipo de aval es obligatorio');
    }

    // Validar que haya encuentros
    if (this.encounters.length === 0) {
      errors.push('El evento debe tener al menos un encuentro');
    } else {
      // Validar cada encuentro
      this.encounters.forEach((encounter, index) => {
        if (!encounter.date) {
          errors.push(`El encuentro ${index + 1} debe tener una fecha`);
        }
        if (!encounter.startTime) {
          errors.push(`El encuentro ${index + 1} debe tener una hora de inicio`);
        }
        if (!encounter.endTime) {
          errors.push(`El encuentro ${index + 1} debe tener una hora de fin`);
        }
        if (!encounter.location) {
          errors.push(`El encuentro ${index + 1} debe tener una instalación`);
        }

        // Validar fechas de encuentros
        if (encounter.date) {
          const fecha = new Date(encounter.date);
          const hoy = new Date();
          hoy.setHours(0, 0, 0, 0);
          
          if (fecha < hoy) {
            errors.push(`La fecha del encuentro ${index + 1} no puede ser en el pasado`);
          }
        }

        // Validar horas de encuentros
        if (encounter.startTime && encounter.endTime) {
          if (encounter.startTime >= encounter.endTime) {
            errors.push(`En el encuentro ${index + 1}, la hora de fin debe ser posterior a la hora de inicio`);
          }
        }
      });
    }

    return errors;
  }

  private buildEventoDTO(): EventoDTO {
    const form = this.eventForm;
    
    // Obtener datos del primer encuentro (fecha, hora inicio, hora fin)
    const primerEncuentro = this.encounters[0];
    
    console.log('🏢 Construyendo EventoDTO...');
    console.log('📋 Primer encuentro:', primerEncuentro);
    console.log('🏢 Ubicación del encuentro:', primerEncuentro?.location);
    
    // Mapear instalaciones desde los encuentros - solo IDs según la estructura especificada
    const instalaciones = this.encounters.map((encounter, index) => {
      const instalacion = {
        idInstalacion: encounter.location?.idInstalacion || 0
      };
      console.log(`🏢 Instalación ${index + 1} ID:`, instalacion.idInstalacion);
      return instalacion;
    });

    // Obtener el primer organizador (el backend espera un solo organizador)
    const organizador = this.selectedUsers[0];
    console.log('👤 Organizador seleccionado:', organizador);

    // Actualizar eventLocation con el ID de la primera instalación
    const primeraInstalacionId = this.encounters[0]?.location?.idInstalacion || 0;
    form.patchValue({ eventLocation: primeraInstalacionId.toString() });
    console.log('📍 EventLocation actualizado con ID de instalación:', primeraInstalacionId);

    const eventoData: EventoDTO = {
      titulo: form.get('eventName')?.value,
      tipoEvento: form.get('eventType')?.value === 'academico' ? 'Académico' : 'Lúdico',
      fecha: primerEncuentro?.date || '',
      horaInicio: primerEncuentro?.startTime || '',
      horaFin: primerEncuentro?.endTime || '',
      instalaciones: instalaciones,
      organizador: { idUsuario: organizador.idUsuario },
      avalPdf: form.get('avalPdf')?.value,
      tipoAval: form.get('tipoAval')?.value
    };

    console.log('📤 EventoDTO construido:', eventoData);
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
    // Verificar si ya está seleccionada
    const isAlreadySelected = this.selectedOrganizations.some(org => org.idOrganizacion === organization.idOrganizacion);
    
    if (!isAlreadySelected) {
      this.selectedOrganizations.push(organization);
      this.updateFormWithSelectedOrganizations();
    }
  }

  onOrganizationRemoved(organization: OrganizacionExternaDTO): void {
    this.selectedOrganizations = this.selectedOrganizations.filter(org => org.idOrganizacion !== organization.idOrganizacion);
    this.updateFormWithSelectedOrganizations();
  }

  private updateFormWithSelectedOrganizations(): void {
    // Actualizar el formulario con las organizaciones seleccionadas
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
    // Verificar si ya está seleccionado
    const isAlreadySelected = this.selectedUsers.some(u => u.idUsuario === user.idUsuario);
    
    if (!isAlreadySelected) {
      this.selectedUsers.push(user);
    }
  }

  onUserRemoved(user: UsuarioDTO): void {
    this.selectedUsers = this.selectedUsers.filter(u => u.idUsuario !== user.idUsuario);
  }

  onEncountersChanged(encounters: Encounter[]): void {
    this.encounters = encounters;
  }

  isFormValid(): boolean {
    // Verificar que el formulario básico sea válido
    const formValid = this.eventForm.valid;
    
    // Verificar que haya encuentros
    const hasEncounters = this.encounters.length > 0;
    
    // Verificar que haya organizadores
    const hasOrganizers = this.selectedUsers.length > 0;
    
    // Verificar que todos los encuentros tengan datos válidos
    const encountersValid = this.encounters.every(encounter => 
      encounter.date && encounter.startTime && encounter.endTime && encounter.location
    );
    
    console.log('🔍 Validación del formulario:', {
      formValid,
      hasEncounters,
      hasOrganizers,
      encountersValid,
      totalValid: formValid && hasEncounters && hasOrganizers && encountersValid
    });
    
    return formValid && hasEncounters && hasOrganizers && encountersValid;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      console.log('📄 Archivo seleccionado:', file.name);
      
      // Convertir archivo a Base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remover el prefijo "data:application/pdf;base64," si existe
        const base64Data = base64String.split(',')[1] || base64String;
        this.eventForm.patchValue({ avalPdf: base64Data });
        console.log('✅ Archivo convertido a Base64');
        console.log('📋 Valor del campo avalPdf:', this.eventForm.get('avalPdf')?.value);
        console.log('📋 Formulario válido después de archivo:', this.eventForm.valid);
      };
      reader.readAsDataURL(file);
    } else {
      // Si no hay archivo, limpiar el campo
      this.selectedFile = null;
      this.eventForm.patchValue({ avalPdf: '' });
      console.log('🗑️ Archivo removido');
    }
  }

}
