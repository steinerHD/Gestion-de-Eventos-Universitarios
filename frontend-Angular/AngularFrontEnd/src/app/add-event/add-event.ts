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
import { OrganizacionExternaComponent } from '../components/organizacion-externa/organizacion-externa';
import { SelectedOrganizationsComponent } from '../components/selected-organizations/selected-organizations';
import { UsuarioSelectionComponent } from '../components/usuario-selection/usuario-selection';
import { SelectedUsersComponent } from '../components/selected-users/selected-users';
import { EncountersComponent, Encounter } from '../components/encounters/encounters';
import { notyf } from '../app'; 

@Component({
  selector: 'app-add-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, OrganizacionExternaComponent, SelectedOrganizationsComponent, UsuarioSelectionComponent, SelectedUsersComponent, EncountersComponent],
  templateUrl: './add-event.html',
  styleUrls: ['./add-event.css']
})
export class AddEventComponent {
  @ViewChild(SelectedOrganizationsComponent) selectedOrganizationsComponent!: SelectedOrganizationsComponent;
  
  eventForm: FormGroup;
  showOrgModal: boolean = false;
  showUserModal: boolean = false;
  selectedOrganizations: OrganizacionExternaDTO[] = [];
  selectedUsers: UsuarioDTO[] = [];
  encounters: Encounter[] = [];
  selectedFile: File | null = null;
  currentUser: any = null; // Usuario logueado actual
  isEdit: boolean = false;
  editingEventId?: number;

  constructor(
    private fb: FormBuilder,
    private eventosApiService: EventosApiService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private organizacionesApiService: OrganizacionesApiService,
    private usuariosApiService: UsuariosApiService,
    private instalacionesApiService: InstalacionesApiService,
    private cdr: ChangeDetectorRef
  ) 
  
  {
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
    
    // Obtener el usuario logueado actual
    this.authService.getUserProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        console.log('👤 Usuario logueado actual:', this.currentUser);
      },
      error: (error) => {
        console.error('❌ Error al obtener usuario logueado:', error);
      }
    });
  }
      ngOnInit(): void {
        this.authService.getUserProfile().subscribe({
        next: (user) => {
          if (!user || user.tipoUsuario == 'Secretaria') {
            notyf.error("Secretaria no puede hacer eventos 💀");
            this.router.navigate(['/home']);
          }
        },
        error: (err) => {
          this.router.navigate(['/home']);
        }
      });

      // Revisar si estamos en modo edición (ruta con id)
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

  private loadEventForEdit(id: number): void {
    this.eventosApiService.getById(id).subscribe({
      next: (event) => {
        console.log('🔁 Cargando evento para edición:', event);
        // Mapear campos básicos
        this.eventForm.patchValue({
          eventName: event.titulo || '',
          eventType: event.tipoEvento && event.tipoEvento.toLowerCase().includes('acad') ? 'academico' : 'ludico',
          eventStatus: event.estado || 'Pendiente',
          avalPdf: event.avalPdf || '',
          tipoAval: event.tipoAval || '',
          externalOrgParticipation: (event.participacionesOrganizaciones || []).length > 0
        });

        // Cargar coorganizadores (usuarios)
        this.selectedUsers = [];
        (event.coorganizadores || []).forEach((uId) => {
          this.usuariosApiService.getById(uId).subscribe({
            next: (u) => {
              this.selectedUsers.push(u);
              this.cdr.detectChanges();
            },
            error: (err) => console.warn('No se pudo cargar usuario coorganizador id=', uId, err)
          });
        });

        // Cargar organizaciones externas seleccionadas (si las hay)
        this.selectedOrganizations = [];
        (event.participacionesOrganizaciones || []).forEach((p) => {
          const orgId = p.idOrganizacion;
          if (orgId) {
            this.organizacionesApiService.getById(orgId).subscribe({
              next: (org) => {
                this.selectedOrganizations.push(org);
                this.cdr.detectChanges();
              },
              error: (err) => console.warn('No se pudo cargar organización id=', orgId, err)
            });
          }
        });

        // Reconstruir encuentros básicos a partir de la información disponible
        this.encounters = [];
        const fecha = event.fecha;
        const horaInicio = event.horaInicio ? event.horaInicio.substring(0,5) : '';
        const horaFin = event.horaFin ? event.horaFin.substring(0,5) : '';

        (event.instalaciones || []).forEach((idInst) => {
          this.instalacionesApiService.getById(idInst).subscribe({
            next: (inst) => {
              this.encounters.push({
                id: Date.now().toString() + '_' + idInst,
                date: fecha,
                startTime: horaInicio,
                endTime: horaFin,
                location: inst
              });
              this.cdr.detectChanges();
            },
            error: (err) => {
              console.warn('No se pudo cargar instalación id=', idInst, err);
              // Si falla la carga de instalación, igual crear un encuentro sin location
              this.encounters.push({ id: Date.now().toString() + '_fallback', date: fecha, startTime: horaInicio, endTime: horaFin, location: null });
              this.cdr.detectChanges();
            }
          });
        });
      },
      error: (err) => {
        console.error('Error al cargar evento para edición:', err);
        notyf.error('No se pudo cargar el evento para edición.');
        this.router.navigate(['/my-events']);
      }
    });
  }
  submitEvent(): void {
    console.log('=== VALIDACIÓN DEL FORMULARIO DE EVENTO ===');
    console.log('📋 Estado del formulario:', this.eventForm.value);
    console.log('📋 Formulario válido:', this.eventForm.valid);
    console.log('📋 Encuentros:', this.encounters);
    console.log('📋 Usuarios seleccionados:', this.selectedUsers);
    console.log('📋 Coorganizadores seleccionados:', this.selectedOrganizations);

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

    const eventoData: EventoDTO = this.buildEventoDTO();

    console.log('📤 Enviando evento al backend:', eventoData);

    // Sanitizar el DTO: eliminar propiedades undefined antes de enviar
    const payload = JSON.parse(JSON.stringify(eventoData));
    console.log('📦 Payload a enviar (sanitizado):', JSON.stringify(payload, null, 2));

    if (this.isEdit && this.editingEventId) {
      this.eventosApiService.update(this.editingEventId, payload).subscribe({
        next: (updated) => {
          console.log('✅ Evento actualizado:', updated);
          alert('Evento actualizado correctamente.');
          this.router.navigate(['/my-events']);
        },
        error: (err) => {
          console.error('❌ Error al actualizar evento:', err, 'error.error=', err?.error);
          alert('Error al actualizar el evento. Revisa la consola y el log del servidor.');
        }
      });
    } else {
      this.eventosApiService.create(payload).subscribe({
        next: (createdEvent) => {
          console.log('✅ Evento creado exitosamente:', createdEvent);
          alert('Evento creado exitosamente.');
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('❌ Error al crear evento:', error, 'error.error=', error?.error);
          console.log(eventoData)
          alert('Error al crear el evento. Verifique la consola para más detalles.');
        }
      });
    }
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
    const primerEncuentro = this.encounters[0]; // Ya validamos que existe al menos uno.

    if (!primerEncuentro || !primerEncuentro.date || !primerEncuentro.startTime || !primerEncuentro.endTime) {
      throw new Error('El primer encuentro no tiene todos los datos necesarios (fecha, hora de inicio, hora de fin).');
    }

    const formatHora = (hora: string) => hora && hora.length === 5 ? hora + ':00' : hora;

    // Solo los IDs de instalaciones
    const instalaciones = this.encounters
      .filter(enc => enc.location?.idInstalacion !== undefined)
      .map(enc => ({
        idInstalacion: enc.location!.idInstalacion
      }));

    // Organizaciones externas completas
    const organizacionesExternas = this.selectedOrganizations
      .filter(org => (org.idOrganizacion !== undefined) || (org as any).id !== undefined);

    // El organizador es el usuario logueado actual
    const organizador = this.currentUser;
    
    // Los coorganizadores son usuarios seleccionados que NO sean el usuario logueado
    const coorganizadores = this.selectedUsers
      .filter(user => user.idUsuario !== this.currentUser?.idUsuario)
      .map(user => user.idUsuario);

    console.log('👤 Usuario logueado (organizador):', organizador);
    console.log('👥 Usuarios seleccionados:', this.selectedUsers);
    console.log('👥 Coorganizadores filtrados:', coorganizadores);
    console.log('🏢 Instalaciones:', instalaciones);
    console.log('🏢 Organizaciones externas completas:', organizacionesExternas);
    console.log('🏢 selectedOrganizations:', this.selectedOrganizations);
    console.log('🏢 selectedOrganizations.length:', this.selectedOrganizations.length);
    console.log('🏢 Primer org idOrganizacion:', this.selectedOrganizations[0]?.idOrganizacion);
    console.log('🏢 Primer org id:', (this.selectedOrganizations[0] as any)?.id);

    const eventoData: EventoDTO = {
      titulo: form.get('eventName')?.value?.trim() || '',
      tipoEvento: form.get('eventType')?.value === 'academico' ? 'Académico' : 'Lúdico',
      fecha: primerEncuentro.date,
      horaInicio: formatHora(primerEncuentro.startTime),
      horaFin: formatHora(primerEncuentro.endTime),

      // ✅ envía solo los IDs, ej: [2, 5]
      instalaciones: (instalaciones || []).map(inst => inst.idInstalacion),

      participacionesOrganizaciones: (organizacionesExternas || []).map(org => {
        const idOrg = org.idOrganizacion || (org as any).id;
        
        // Obtener los datos de la organización desde el componente de organizaciones seleccionadas
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
        
        const participacion = {
          idOrganizacion: idOrg,
          nombreOrganizacion: org.nombre || '',
          certificadoPdf: orgData.avalFilePath || `certificado_org${idOrg}.pdf`, // Usar la ruta del archivo si existe
          representanteDiferente: !orgData.participaRepresentante, // Si NO participa el representante, entonces es diferente
          nombreRepresentanteDiferente: orgData.participaRepresentante ? undefined : orgData.nombreRepresentante
        };
        console.log('📋 Participación creada:', participacion);
        console.log('📋 Datos de la organización:', orgData);
        return participacion;
      }),

      // ✅ el primero es el organizador, los demás coorganizadores
      coorganizadores: coorganizadores,

      idOrganizador: organizador?.idUsuario || 0,

      avalPdf: form.get('avalPdf')?.value || '',
      tipoAval: form.get('tipoAval')?.value || undefined,

      // En edición, si hay un valor en el formulario para estado, respetarlo
      estado: form.get('eventStatus')?.value || 'Borrador'
    };

    console.log('📤 EventoDTO construido (final):', eventoData);
    console.log('📤 participacionesOrganizaciones final:', eventoData.participacionesOrganizaciones);
    console.log('📤 participacionesOrganizaciones.length:', eventoData.participacionesOrganizaciones?.length);
    console.log('📤 coorganizadores final:', eventoData.coorganizadores);
    console.log('📤 idOrganizador final:', eventoData.idOrganizador);
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
    // Obtener el ID correcto (puede ser 'id' o 'idOrganizacion')
    const orgId = organization.idOrganizacion || (organization as any).id;
    const existingOrgId = this.selectedOrganizations.find(org => {
      const existingId = org.idOrganizacion || (org as any).id;
      return existingId === orgId;
    });
    
    if (!existingOrgId) {
      this.selectedOrganizations.push(organization);
      console.log('✅ Organización agregada:', organization.nombre);
      
      // Forzar detección de cambios
      this.cdr.detectChanges();
    } else {
      console.log('⚠️ Organización ya existe:', organization.nombre);
    }
  }

  onOrganizationRemoved(organization: OrganizacionExternaDTO): void {
    const orgId = organization.idOrganizacion || (organization as any).id;
    this.selectedOrganizations = this.selectedOrganizations.filter(org => {
      const existingId = org.idOrganizacion || (org as any).id;
      return existingId !== orgId;
    });
    console.log('❌ Organización removida:', organization.nombre);
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
      // Limpiar los datos de las organizaciones cuando se desactiva la participación
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
    const encountersValid = this.encounters.every(e => e.date && e.startTime && e.endTime && e.location);

    return formValid && hasEncounters && encountersValid;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // file.path NO está disponible por seguridad en navegadores
      // solo en Electron o Node.js
      const fakePath = event.target.value; // ejemplo: "C:\\fakepath\\archivo.pdf"
      this.eventForm.patchValue({ avalPdf: fakePath });
    } else {
      this.eventForm.patchValue({ avalPdf: '' });
    }
  }
}
