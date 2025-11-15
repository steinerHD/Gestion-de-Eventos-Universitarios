import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { EventosApiService, EventoDTO } from '../services/eventos.api.service';
import { OrganizacionExternaDTO } from '../services/organizaciones.api.service';
import { UsuarioDTO } from '../services/usuarios.api.service';
import { AuthService } from '../services/auth.service';
import { OrganizacionesApiService } from '../services/organizaciones.api.service';
import { UsuariosApiService } from '../services/usuarios.api.service';
import { InstalacionesApiService } from '../services/instalaciones.api.service';
import { InputValidationService, forbidDangerousContent } from '../services/input-validation.service';
import { OrganizacionExternaComponent } from '../components/organizacion-externa/organizacion-externa';
import { SelectedOrganizationsComponent } from '../components/selected-organizations/selected-organizations';
import { UsuarioSelectionComponent } from '../components/usuario-selection/usuario-selection';
import { EncountersComponent, Encounter } from '../components/encounters/encounters';
import { notyf } from '../app';

// Interfaz para organizador con aval individual
export interface Organizador {
  usuario: UsuarioDTO;
  rol: 'ORGANIZADOR';
  avalPdf: string;
  tipoAval: string;
  selectedFile?: File;
  requiresAval: boolean;
  errorMessage?: string;
}

@Component({
  selector: 'app-add-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, OrganizacionExternaComponent, SelectedOrganizationsComponent, UsuarioSelectionComponent, EncountersComponent],
  templateUrl: './add-event.html',
  styleUrls: ['./add-event.css']
})
export class AddEventComponent {
  @ViewChild(SelectedOrganizationsComponent) selectedOrganizationsComponent!: SelectedOrganizationsComponent;
  
  eventForm: FormGroup;
  showOrgModal: boolean = false;
  showUserModal: boolean = false;
  showOrganizerModal: boolean = false;
  selectedOrganizations: OrganizacionExternaDTO[] = [];
  initialOrgData: { [key: string]: { participaRepresentante?: boolean, nombreRepresentante?: string, cedulaRepresentante?: string, avalFilePath?: string, avalFileName?: string }} = {};
  
  organizadores: Organizador[] = [];
  encounters: Encounter[] = [];
  currentUser: any = null;
  isEdit: boolean = false;
  editingEventId?: number;
  timeError: string = '';

  constructor(
    private fb: FormBuilder,
    private eventosApiService: EventosApiService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private organizacionesApiService: OrganizacionesApiService,
    private usuariosApiService: UsuariosApiService,
    private instalacionesApiService: InstalacionesApiService,
    private inputValidation: InputValidationService,
    private cdr: ChangeDetectorRef
  ) {
    this.eventForm = this.fb.group({
      eventName: ['', [Validators.required, forbidDangerousContent(this.inputValidation)]],
      eventLocation: ['', [forbidDangerousContent(this.inputValidation)]],
      eventType: ['', Validators.required],
      eventStatus: ['Borrador', Validators.required],
      externalOrgName: ['', [forbidDangerousContent(this.inputValidation)]],
      externalOrgNit: ['', [forbidDangerousContent(this.inputValidation)]],
      externalOrgParticipation: [false]
    });
    
    this.authService.getUserProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        console.log('?? Usuario logueado:', this.currentUser);
        if (user) {
          this.addOrganizerAsMain(user);
        }
      },
      error: (error) => {
        console.error('? Error al obtener usuario:', error);
      }
    });
  }

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe({
      next: (user) => {
        if (!user || user.tipoUsuario === 'secretaria') {
          notyf.error("Secretaria no puede hacer eventos ??");
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.router.navigate(['/home']);
      }
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      if (!isNaN(id)) {
        this.isEdit = true;
        this.editingEventId = id;
        this.loadEventForEdit(id);
      }
    }
  }

  private addOrganizerAsMain(user: UsuarioDTO): void {
    const exists = this.organizadores.some(org => org.usuario.idUsuario === user.idUsuario);
    if (!exists) {
      this.organizadores.push({
        usuario: user,
        rol: 'ORGANIZADOR',
        avalPdf: '',
        tipoAval: '',
        requiresAval: true
      });
      console.log('? Organizador principal:', user.nombre);
    }
  }

  private calculateRequiresAval(user: UsuarioDTO): boolean {
    if (user.tipoUsuario === 'docente') return true;
    const mainOrganizerIsStudent = this.organizadores[0]?.usuario.tipoUsuario === 'estudiante';
    if (mainOrganizerIsStudent && user.tipoUsuario === 'estudiante') {
      return this.organizadores[0]?.usuario.programa !== user.programa;
    }
    return false;
  }

  addOrganizer(user: UsuarioDTO): void {
    const exists = this.organizadores.some(org => org.usuario.idUsuario === user.idUsuario);
    if (exists) {
      notyf.error('Este usuario ya es organizador');
      return;
    }
    this.organizadores.push({
      usuario: user,
      rol: 'ORGANIZADOR',
      avalPdf: '',
      tipoAval: '',
      requiresAval: this.calculateRequiresAval(user)
    });
    console.log('? Organizador agregado:', user.nombre);
    this.cdr.detectChanges();
  }

  removeOrganizer(user: UsuarioDTO): void {
    if (this.organizadores[0]?.usuario.idUsuario === user.idUsuario) {
      notyf.error('No se puede remover el organizador principal');
      return;
    }
    this.organizadores = this.organizadores.filter(org => org.usuario.idUsuario !== user.idUsuario);
    console.log('? Organizador removido:', user.nombre);
  }

  openOrganizerModal(): void {
    this.showOrganizerModal = true;
  }

  closeOrganizerModal(): void {
    this.showOrganizerModal = false;
  }

  onOrganizerSelected(user: UsuarioDTO): void {
    this.addOrganizer(user);
    this.closeOrganizerModal();
  }

  onOrganizerAvalChanged(organizador: Organizador, event: any): void {
    const file = event.target.files[0];
    const input = event.target as HTMLInputElement;
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        notyf.error('Por favor, selecciona un archivo PDF.');
        organizador.selectedFile = undefined;
        organizador.avalPdf = '';
        if (input) input.value = '';
        organizador.errorMessage = 'Solo se permiten archivos PDF';
        return;
      }
      organizador.selectedFile = file;
      organizador.avalPdf = file.name;
      organizador.errorMessage = undefined;
    } else {
      organizador.avalPdf = '';
      organizador.selectedFile = undefined;
    }
  }

  getDisplayedAvalName(organizador: Organizador): string | null {
    if (organizador.selectedFile) return organizador.selectedFile.name;
    if (!organizador.avalPdf) return null;
    try {
      const parts = String(organizador.avalPdf).split('/');
      return parts[parts.length - 1] || String(organizador.avalPdf);
    } catch (e) {
      return String(organizador.avalPdf);
    }
  }

  private loadEventForEdit(id: number): void {
    this.eventosApiService.getById(id).subscribe({
      next: (event) => {
        this.eventForm.patchValue({
          eventName: event.titulo || '',
          eventType: event.tipoEvento && event.tipoEvento.toLowerCase().includes('acad') ? 'academico' : 'ludico',
          eventStatus: event.estado || 'Pendiente',
          externalOrgParticipation: (event.participacionesOrganizaciones || []).length > 0
        });

        if (event.organizadores) {
          event.organizadores.forEach((orgData: any) => {
            if (orgData.usuario.idUsuario !== this.currentUser?.idUsuario) {
              this.organizadores.push({
                usuario: orgData.usuario,
                rol: 'ORGANIZADOR',
                avalPdf: orgData.avalPdf || '',
                tipoAval: orgData.tipoAval || '',
                requiresAval: this.calculateRequiresAval(orgData.usuario)
              });
            }
          });
        }

        this.selectedOrganizations = [];
        (event.participacionesOrganizaciones || []).forEach((p: any) => {
          const orgId = p.idOrganizacion;
          if (orgId) {
            this.organizacionesApiService.getById(orgId).subscribe({
              next: (org) => {
                this.selectedOrganizations.push(org);
                const filename = p.certificadoPdf ? (String(p.certificadoPdf).split('/').pop() || '') : '';
                this.initialOrgData[String(orgId)] = {
                  participaRepresentante: p.representanteDiferente !== undefined ? !p.representanteDiferente : undefined,
                  nombreRepresentante: p.nombreRepresentanteDiferente || '',
                  cedulaRepresentante: '',
                  avalFilePath: p.certificadoPdf || '',
                  avalFileName: filename
                };
                this.cdr.detectChanges();
              },
              error: (err) => console.warn('Error al cargar org id=', orgId, err)
            });
          }
        });

        this.encounters = [];
        const fecha = event.fecha;
        const horaInicio = event.horaInicio ? event.horaInicio.substring(0,5) : '';
        const horaFin = event.horaFin ? event.horaFin.substring(0,5) : '';

        (event.instalaciones || []).forEach((idInst: any) => {
          this.instalacionesApiService.getById(idInst).subscribe({
            next: (inst) => {
              this.encounters.push({ id: Date.now().toString() + '_' + idInst, date: fecha, startTime: horaInicio, endTime: horaFin, location: inst });
              this.cdr.detectChanges();
            },
            error: (err) => {
              this.encounters.push({ id: Date.now().toString() + '_fallback', date: fecha, startTime: horaInicio, endTime: horaFin, location: null });
              this.cdr.detectChanges();
            }
          });
        });
      },
      error: (err) => {
        console.error('Error al cargar evento:', err);
        notyf.error('No se pudo cargar el evento.');
        this.router.navigate(['/my-events']);
      }
    });
  }

  submitEvent(): void {
    if (!this.validateInstallations()) {
      notyf.error('Cada encuentro debe tener una instalación seleccionada');
      return;
    }
    if (!this.validateTimes()) {
      notyf.error('La hora de inicio debe ser menor que la hora de fin');
      return;
    }

    const orgsSinAval = this.organizadores.filter(org => org.requiresAval && !org.avalPdf);
    if (orgsSinAval.length > 0) {
      const nombres = orgsSinAval.map(o => o.usuario.nombre).join(', ');
      notyf.error(`Organizadores sin aval: ${nombres}`);
      return;
    }

    if (!this.eventForm.valid) {
      this.eventForm.markAllAsTouched();
      notyf.error('Por favor, complete todos los campos requeridos.');
      return;
    }

    if (this.encounters.length === 0) {
      notyf.error('El evento debe tener al menos un encuentro.');
      return;
    }

    this.uploadAllAvalsAndCreate();
  }

  private uploadAllAvalsAndCreate(): void {
    const avalesToUpload = this.organizadores.filter(org => org.selectedFile);
    let uploadedCount = 0;

    if (avalesToUpload.length === 0) {
      this.createOrUpdateEvent();
      return;
    }

    avalesToUpload.forEach(org => {
      if (org.selectedFile) {
        this.eventosApiService.uploadAval(org.selectedFile!).subscribe({
          next: (resp) => {
            org.avalPdf = resp.path;
            uploadedCount++;
            if (uploadedCount === avalesToUpload.length) {
              this.createOrUpdateEvent();
            }
          },
          error: (err) => {
            console.error('Error al subir aval:', err);
            notyf.error(`Error al subir aval para ${org.usuario.nombre}`);
          }
        });
      }
    });
  }

  private createOrUpdateEvent(): void {
    const eventoData = this.buildEventoDTO();
    const payload = JSON.parse(JSON.stringify(eventoData));

    if (this.isEdit && this.editingEventId) {
      this.eventosApiService.update(this.editingEventId, payload).subscribe({
        next: (updated) => {
          notyf.success('Evento actualizado correctamente.');
          this.router.navigate(['/my-events']);
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          notyf.error('Error al actualizar el evento.');
        }
      });
    } else {
      this.eventosApiService.create(payload).subscribe({
        next: (createdEvent) => {
          notyf.success('Evento creado exitosamente.');
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Error al crear:', error);
          notyf.error('Error al crear el evento.');
        }
      });
    }
  }

  private validateForm(): string[] {
    const errors: string[] = [];
    const form = this.eventForm;
    if (!form.get('eventName')?.value?.trim()) errors.push('Título requerido');
    if (!form.get('eventType')?.value) errors.push('Tipo requerido');
    if (this.encounters.length === 0) errors.push('Al menos un encuentro');
    return errors;
  }

  private buildEventoDTO(): EventoDTO {
    const form = this.eventForm;
    const primerEncuentro = this.encounters[0];
    const formatHora = (hora: string) => hora && hora.length === 5 ? hora + ':00' : hora;

    const instalaciones = this.encounters
      .filter(enc => enc.location?.idInstalacion !== undefined)
      .map(enc => enc.location!.idInstalacion);

    const organizadoresData = this.organizadores.map(org => ({
      idUsuario: org.usuario.idUsuario,
      avalPdf: org.avalPdf || '',
      tipoAval: org.tipoAval || '',
      rol: org.rol
    }));

    const organizacionesExternas = this.selectedOrganizations.filter(org => org.idOrganizacion !== undefined);
    const participacionesOrganizaciones = (organizacionesExternas || []).map(org => {
      const idOrg = org.idOrganizacion || (org as any).id;
      let orgData = {
        participaRepresentante: false,
        nombreRepresentante: '',
        cedulaRepresentante: '',
        avalFilePath: '',
        avalFileName: ''
      };
      if (this.selectedOrganizationsComponent) {
        orgData = this.selectedOrganizationsComponent.getOrganizationDataById(idOrg);
      }
      return {
        idOrganizacion: idOrg,
        nombreOrganizacion: org.nombre || '',
        certificadoPdf: orgData.avalFilePath || `certificado_org${idOrg}.pdf`,
        representanteDiferente: !orgData.participaRepresentante,
        nombreRepresentanteDiferente: orgData.participaRepresentante ? undefined : orgData.nombreRepresentante
      };
    });

    return {
      titulo: form.get('eventName')?.value?.trim() || '',
      tipoEvento: form.get('eventType')?.value === 'academico' ? 'Académico' : 'Lúdico',
      fecha: primerEncuentro.date,
      horaInicio: formatHora(primerEncuentro.startTime),
      horaFin: formatHora(primerEncuentro.endTime),
      instalaciones: instalaciones,
      participacionesOrganizaciones: participacionesOrganizaciones,
      organizadores: organizadoresData,
      idOrganizador: this.currentUser?.idUsuario || 0,
      estado: form.get('eventStatus')?.value || 'Borrador'
    };
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
    const orgId = organization.idOrganizacion || (organization as any).id;
    const exists = this.selectedOrganizations.find(org => {
      const existingId = org.idOrganizacion || (org as any).id;
      return existingId === orgId;
    });
    if (!exists) {
      this.selectedOrganizations.push(organization);
      this.cdr.detectChanges();
    }
  }

  onOrganizationRemoved(organization: OrganizacionExternaDTO): void {
    const orgId = organization.idOrganizacion || (organization as any).id;
    this.selectedOrganizations = this.selectedOrganizations.filter(org => {
      const existingId = org.idOrganizacion || (org as any).id;
      return existingId !== orgId;
    });
  }

  onParticipationChange(): void {
    const participation = this.eventForm.get('externalOrgParticipation')?.value;
    if (!participation) {
      this.selectedOrganizations = [];
    }
  }

  onEncountersChanged(encounters: Encounter[]): void {
    this.encounters = encounters;
  }

  isFormValid(): boolean {
    const formValid = this.eventForm.valid;
    const hasEncounters = this.encounters && this.encounters.length > 0;
    const encountersValid = this.encounters.every(e => e.date && e.startTime && e.endTime && e.location);
    const timesValid = this.validateTimes();
    const orgsSinAval = this.organizadores.filter(org => org.requiresAval && !org.avalPdf).length === 0;
    return formValid && hasEncounters && encountersValid && timesValid && orgsSinAval;
  }

  validateInstallations(): boolean {
    if (!this.encounters || this.encounters.length === 0) return true;
    return this.encounters.every(encounter => encounter.location !== null && encounter.location !== undefined);
  }

  validateTimes(): boolean {
    if (!this.encounters || this.encounters.length === 0) return false;
    this.timeError = '';
    for (let i = 0; i < this.encounters.length; i++) {
      const encounter = this.encounters[i];
      if (!encounter.startTime || !encounter.endTime) return false;
      const getMinutes = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
      };
      const startMinutes = getMinutes(encounter.startTime);
      const endMinutes = getMinutes(encounter.endTime);
      if (startMinutes >= endMinutes) {
        this.timeError = `Encuentro ${i + 1}: Hora inicio no puede ser >= fin`;
        return false;
      }
    }
    return true;
  }

  private getDangerousFields(): string[] {
    const dangerousFields: string[] = [];
    const fieldNames: { [key: string]: string } = {
      'eventName': 'Nombre',
      'eventLocation': 'Ubicación',
      'externalOrgName': 'Org Externa',
      'externalOrgNit': 'NIT'
    };
    Object.keys(fieldNames).forEach(fieldName => {
      const control = this.eventForm.get(fieldName);
      if (control && control.hasError('dangerousContent')) {
        dangerousFields.push(fieldNames[fieldName]);
      }
    });
    return dangerousFields;
  }
}
