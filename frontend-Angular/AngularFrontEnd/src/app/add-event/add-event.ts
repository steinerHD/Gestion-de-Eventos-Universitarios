import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, OrganizacionExternaComponent, SelectedOrganizationsComponent, UsuarioSelectionComponent, EncountersComponent],
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
  eventCapacity: number = 0;

  get selectedUsers(): UsuarioDTO[] {
    return this.organizadores.map(org => org.usuario);
  }
  // Lista que se pasa al modal para que mantenga estado por referencia
  modalSelectedUsuarios: UsuarioDTO[] = [];

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
      eventDate: ['', Validators.required],
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
    } else {
      // Solo en modo creación agregamos el currentUser como organizador principal
      if (this.currentUser) {
        this.addOrganizerAsMain(this.currentUser);
      } else {
        // Si currentUser aún no está disponible, esperar a que se cargue
        const subscription = this.authService.getUserProfile().subscribe({
          next: (user) => {
            if (user && !this.isEdit) {
              this.addOrganizerAsMain(user);
            }
            subscription.unsubscribe();
          }
        });
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
      this.modalSelectedUsuarios.push(user);
      console.log('✅ Organizador principal:', user.nombre);
    }
  }

  // Recalcula requiresAval para todos los organizadores (útil si cambia el principal)
  private recalculateRequiresAvalForAll(): void {
    this.organizadores = this.organizadores.map(org => ({
      ...org,
      requiresAval: this.calculateRequiresAval(org.usuario)
    }));
    this.cdr.detectChanges();
  }

  /**
   * Normaliza cadenas: trim, lower-case y remueve diacríticos (tildes).
   */
  private normalizeString(s?: string): string {
    if (!s) return '';
    try {
      return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    } catch (e) {
      return s.toLowerCase().trim();
    }
  }

  /**
   * Intenta obtener el programa desde el objeto usuario.
   * Soporta estructuras planas o anidadas (usuario.estudiante.programa, usuario.programa, etc.)
   */
  private getProgramFromUser(user: any): string {
    if (!user) return '';
    if (user.estudiante && user.estudiante.programa) return user.estudiante.programa;
    if (user.programa) return user.programa;
    if (user.program) return user.program;
    return '';
  }

  /**
   * Detecta si el usuario es estudiante.
   */
  private isStudent(user: any): boolean {
    if (!user) return false;
    if (user.estudiante) return true;
    if (user.tipoUsuario && typeof user.tipoUsuario === 'string') {
      return user.tipoUsuario.toLowerCase().includes('estudiante');
    }
    return false;
  }

  /**
   * Detecta si el usuario es docente.
   */
  private isDocente(user: any): boolean {
    if (!user) return false;
    if (user.docente) return true;
    if (user.tipoUsuario && typeof user.tipoUsuario === 'string') {
      return user.tipoUsuario.toLowerCase().includes('docente');
    }
    return false;
  }

  /**
   * Calcula si un organizador necesita aval comparándolo SIEMPRE con el currentUser (usuario logueado).
   * Reglas aplicadas:
   *  - Si el usuario evaluado ES el currentUser -> siempre requiere aval (es el organizador principal)
   *  - Si es docente -> requiere aval
   *  - Si el currentUser es docente -> todos los coorganizadores requieren aval
   *  - Si ambos son estudiantes y sus programas (normalizados) coinciden -> NO requiere aval
   *  - En cualquier otro caso -> requiere aval
   */
  private calculateRequiresAval(user: UsuarioDTO): boolean {
    const anyU: any = user as any;

    // Si el usuario evaluado ES el currentUser (organizador principal), siempre requiere aval
    if (this.currentUser && user.idUsuario === this.currentUser.idUsuario) {
      console.log('✅ calculateRequiresAval: es el organizador principal (currentUser) -> requiere aval', { usuario: user.nombre });
      return true;
    }

    // Si es docente, siempre requiere aval
    if (this.isDocente(anyU)) {
      console.log('🔴 calculateRequiresAval: es docente -> requiere aval', { usuario: user.nombre });
      return true;
    }

    // El principal SIEMPRE es el currentUser
    const principal: any = this.currentUser;

    if (!principal) {
      console.log('🔴 calculateRequiresAval: no hay currentUser -> requiere aval por seguridad');
      return true;
    }

    // Si el principal (currentUser) es docente, cualquier coorganizador requiere aval
    if (this.isDocente(principal)) {
      console.log('🔴 calculateRequiresAval: principal (currentUser) es docente -> coorganizador requiere aval');
      return true;
    }

    // Si ambos son estudiantes, comparar programas
    if (this.isStudent(anyU) && this.isStudent(principal)) {
      const progPrincipalRaw = this.getProgramFromUser(principal);
      const progUserRaw = this.getProgramFromUser(anyU);
      
      const progPrincipal = this.normalizeString(progPrincipalRaw);
      const progUser = this.normalizeString(progUserRaw);

      console.log('🔍 calculateRequiresAval:', {
        principalId: principal.idUsuario,
        principalNombre: principal.nombre,
        progPrincipalRaw,
        progUserRaw,
        progPrincipalNorm: progPrincipal,
        progUserNorm: progUser,
        usuarioId: user.idUsuario,
        usuarioNombre: user.nombre
      });

      // Si no conseguimos ambos programas -> exigir aval
      if (!progPrincipal || !progUser) {
        console.log('🔴 calculateRequiresAval: faltan programas -> requiere aval');
        return true;
      }

      // Si programas normalizados coinciden -> NO requiere aval
      const sameProgram = progPrincipal === progUser;
      console.log(sameProgram ? '✅ calculateRequiresAval: mismo programa que currentUser -> NO requiere aval' : '🔴 calculateRequiresAval: programas diferentes -> requiere aval');
      return !sameProgram;
    }

    // Por defecto, requiere aval
    console.log('🔴 calculateRequiresAval: caso por defecto -> requiere aval');
    return true;
  }

  addOrganizer(user: UsuarioDTO): void {
    const exists = this.organizadores.some(org => org.usuario.idUsuario === user.idUsuario);
    if (exists) {
      notyf.error('Este usuario ya es organizador');
      return;
    }
    const requires = this.calculateRequiresAval(user);
    this.organizadores.push({
      usuario: user,
      rol: 'ORGANIZADOR',
      avalPdf: '',
      tipoAval: '',
      requiresAval: requires
    });
    this.modalSelectedUsuarios.push(user);
    console.log('? Organizador agregado:', user.nombre, 'requiresAval=', requires);
    // Recalcular para asegurar consistencia (p. ej. si el principal fue agregado recientemente)
    this.recalculateRequiresAvalForAll();
  }

  removeOrganizer(user: UsuarioDTO): void {
    if (this.organizadores[0]?.usuario.idUsuario === user.idUsuario) {
      notyf.error('No se puede remover el organizador principal');
      return;
    }
    this.organizadores = this.organizadores.filter(org => org.usuario.idUsuario !== user.idUsuario);
    this.modalSelectedUsuarios = this.modalSelectedUsuarios.filter(u => u.idUsuario !== user.idUsuario);
    console.log('? Organizador removido:', user.nombre);
  }

  openOrganizerModal(): void {
    this.showOrganizerModal = true;
  }

  closeOrganizerModal(): void {
    this.showOrganizerModal = false;
  }

  onOrganizerSelected(user: UsuarioDTO): void {
    console.log('Usuario seleccionado desde modal:', user);
    this.addOrganizer(user);
    this.closeOrganizerModal();
  }

  getUsuarioTypeLabel(usuario: UsuarioDTO | undefined): string {
    if (!usuario) return '';
    const anyU: any = usuario as any;
    // Primero, detectar propiedades anidadas (p. ej. usuario.docente o usuario.estudiante)
    if (anyU.docente) {
      const unidad = anyU.docente.unidadAcademica || anyU.docente.unidad || '';
      return `Docente${unidad ? ' - ' + unidad : ''}`;
    }
    if (anyU.estudiante) {
      const programa = anyU.estudiante.programa || usuario.programa || '';
      return `Estudiante${programa ? ' - ' + programa : ''}`;
    }
    // Caso normal cuando tipoUsuario está presente
    switch (usuario.tipoUsuario) {
      case 'estudiante':
        return `Estudiante${usuario.programa ? ' - ' + usuario.programa : ''}`;
      case 'docente':
        return `Docente${usuario.unidadAcademica ? ' - ' + usuario.unidadAcademica : ''}`;
      case 'secretaria':
        return `Secretaría${usuario.facultad ? ' - ' + usuario.facultad : ''}`;
      default:
        if (anyU.tipo) return anyU.tipo;
        return usuario.tipoUsuario || '';
    }
  }

  getUsuarioProgramLabel(usuario: UsuarioDTO | undefined): string {
    if (!usuario) return '';
    const anyU: any = usuario as any;
    return anyU.estudiante?.programa || usuario.programa || anyU.programa || '';
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
        console.log('📦 Evento cargado para editar:', event);
        console.log('📋 Participaciones organizaciones:', event.participacionesOrganizaciones);
        
        // Cargar capacidad del evento
        this.eventCapacity = event.capacidad || 0;
        
        this.eventForm.patchValue({
          eventName: event.titulo || '',
          eventDate: event.fecha || '',
          eventType: event.tipoEvento && event.tipoEvento.toLowerCase().includes('acad') ? 'academico' : 'ludico',
          eventStatus: event.estado || 'Pendiente',
          externalOrgParticipation: (event.participacionesOrganizaciones || []).length > 0
        });

        // Cargar organizadores del evento con sus avales desde organizadores
        // Ordenar para que el currentUser (organizador principal) sea el primero
        if (event.organizadores && Array.isArray(event.organizadores)) {
          // Separar organizador principal de coorganizadores
          const organizadorPrincipal = event.organizadores.find((eo: any) => {
            const userId = eo.idUsuario || eo.usuario?.idUsuario;
            return userId === this.currentUser?.idUsuario;
          });
          
          const coorganizadores = event.organizadores.filter((eo: any) => {
            const userId = eo.idUsuario || eo.usuario?.idUsuario;
            return userId !== this.currentUser?.idUsuario;
          });

          // Crear array ordenado: principal primero, luego coorganizadores
          const organizadoresOrdenados = organizadorPrincipal 
            ? [organizadorPrincipal, ...coorganizadores] 
            : event.organizadores;

          organizadoresOrdenados.forEach((eo: any) => {
            const userId = eo.idUsuario || eo.usuario?.idUsuario;
            if (userId) {
              this.usuariosApiService.getById(userId).subscribe({
                next: (user) => {
                  this.organizadores.push({
                    usuario: user,
                    rol: 'ORGANIZADOR',
                    avalPdf: eo.avalPdf || '',
                    tipoAval: eo.tipoAval || '',
                    requiresAval: this.calculateRequiresAval(user)
                  });
                  this.modalSelectedUsuarios.push(user);
                  this.cdr.detectChanges();
                },
                error: (err) => console.warn('Error al cargar usuario:', userId, err)
              });
            }
          });
        }

        this.selectedOrganizations = [];
        const participaciones = event.participacionesOrganizaciones || [];
        console.log('🏢 Procesando participaciones:', participaciones);
        
        // Primero, cargar todos los datos iniciales de forma síncrona
        participaciones.forEach((p: any) => {
          const orgId = p.idOrganizacion;
          if (orgId) {
            const filename = p.certificadoPdf ? (String(p.certificadoPdf).split('/').pop() || '') : '';
            this.initialOrgData[String(orgId)] = {
              participaRepresentante: p.representanteDiferente !== undefined ? !p.representanteDiferente : undefined,
              nombreRepresentante: p.nombreRepresentanteDiferente || '',
              cedulaRepresentante: '',
              avalFilePath: p.certificadoPdf || '',
              avalFileName: filename
            };
          }
        });
        console.log('📋 initialOrgData preparado:', this.initialOrgData);
        
        // Luego, cargar las organizaciones de forma asíncrona
        participaciones.forEach((p: any) => {
          console.log('🔍 Procesando participación:', p);
          const orgId = p.idOrganizacion;
          if (orgId) {
            console.log('📞 Cargando organización con ID:', orgId);
            this.organizacionesApiService.getById(orgId).subscribe({
              next: (org) => {
                console.log('✅ Organización cargada:', org);
                this.selectedOrganizations.push(org);
                console.log('📊 selectedOrganizations ahora tiene:', this.selectedOrganizations.length, 'organizaciones');
                this.cdr.detectChanges();
              },
              error: (err) => {
                console.error('❌ Error al cargar org id=', orgId, err);
              }
            });
          } else {
            console.warn('⚠️ Participación sin idOrganizacion:', p);
          }
        });

        // Cargar encounters desde instalaciones con horarios individuales
        this.encounters = [];
        (event.instalaciones || []).forEach((instData: any) => {
          const idInst = instData.idInstalacion;
          const horaInicio = instData.horaInicio ? instData.horaInicio.substring(0,5) : '';
          const horaFin = instData.horaFin ? instData.horaFin.substring(0,5) : '';

          this.instalacionesApiService.getById(idInst).subscribe({
            next: (inst) => {
              this.encounters.push({ 
                id: Date.now().toString() + '_' + idInst, 
                startTime: horaInicio, 
                endTime: horaFin, 
                location: inst 
              });
              this.cdr.detectChanges();
            },
            error: (err) => {
              this.encounters.push({ 
                id: Date.now().toString() + '_fallback', 
                startTime: horaInicio, 
                endTime: horaFin, 
                location: null 
              });
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
    if (!this.validateCapacity()) {
      return; // El método validateCapacity ya muestra el error
    }
    if (!this.validateTimes()) {
      notyf.error('La hora de inicio debe ser menor que la hora de fin');
      return;
    }
    
    // Validar que la fecha del evento sea futura (no hoy ni en el pasado)
    const eventDate = this.eventForm.get('fecha')?.value;
    if (eventDate) {
      const selectedDate = new Date(eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Resetear las horas para comparar solo fechas
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate <= today) {
        notyf.error('La fecha del evento debe ser posterior a hoy. No se permiten eventos para hoy o fechas pasadas.');
        return;
      }
    }

    const orgsSinAval = this.organizadores.filter(org => org.requiresAval && !org.avalPdf);
    if (orgsSinAval.length > 0) {
      const nombres = orgsSinAval.map(o => o.usuario.nombre).join(', ');
      notyf.error(`Organizadores sin aval: ${nombres}`);
      return;
    }

    const orgsSinTipoAval = this.organizadores.filter(org => org.requiresAval && !org.tipoAval);
    if (orgsSinTipoAval.length > 0) {
      const nombres = orgsSinTipoAval.map(o => o.usuario.nombre).join(', ');
      notyf.error(`Organizadores sin tipo de aval: ${nombres}`);
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
          // Solo mostrar error si el interceptor no lo ha manejado
          if (!(err && (err as any)._notyfHandled)) {
            let errorMessage = 'Error al actualizar el evento.';
            if (err.error) {
              if (typeof err.error === 'string') {
                errorMessage = err.error;
              } else if (err.error.error) {
                errorMessage = err.error.error;
              } else if (err.error.message) {
                errorMessage = err.error.message;
              }
            } else if (err.message) {
              errorMessage = err.message;
            }
            notyf.error(errorMessage);
          }
        }
      });
    } else {
      this.eventosApiService.create(payload).subscribe({
        next: (createdEvent) => {
          notyf.success('Evento creado exitosamente.');
          this.router.navigate(['/my-events']);
        },
        error: (error) => {
          console.error('Error al crear:', error);
          console.log('error.error:', error.error);
          console.log('typeof error.error:', typeof error.error);
          console.log('error._notyfHandled:', (error as any)._notyfHandled);
          
          // Solo mostrar error si el interceptor no lo ha manejado
          if (!(error && (error as any)._notyfHandled)) {
            let errorMessage = 'Error al crear el evento.';
            if (error.error) {
              if (typeof error.error === 'string') {
                errorMessage = error.error;
              } else if (error.error.error) {
                errorMessage = error.error.error;
              } else if (error.error.message) {
                errorMessage = error.error.message;
              }
            } else if (error.message) {
              errorMessage = error.message;
            }
            console.log('Mostrando error message:', errorMessage);
            notyf.error(errorMessage);
          } else {
            console.log('Error ya manejado por interceptor, no se muestra notyf');
          }
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
    const formatHora = (hora: string) => hora && hora.length === 5 ? hora + ':00' : hora;

    const instalaciones = this.encounters
      .filter(enc => enc.location?.idInstalacion !== undefined)
      .map(enc => ({
        idInstalacion: enc.location!.idInstalacion,
        horaInicio: formatHora(enc.startTime),
        horaFin: formatHora(enc.endTime)
      }));

    const organizadoresData = this.organizadores.map((org, index) => ({
      idUsuario: org.usuario.idUsuario,
      avalPdf: org.avalPdf || '',
      tipoAval: (org.tipoAval || 'Director_Programa') as 'Director_Programa' | 'Director_Docencia',
      rol: org.usuario.idUsuario === this.currentUser?.idUsuario ? 'ORGANIZADOR' : 'COORGANIZADOR'
    }));

    console.log('🏗️ [buildEventoDTO] selectedOrganizations:', this.selectedOrganizations);
    console.log('🏗️ [buildEventoDTO] selectedOrganizationsComponent:', this.selectedOrganizationsComponent);
    
    const organizacionesExternas = this.selectedOrganizations.filter(org => 
      (org.idOrganizacion !== undefined) || ((org as any).id !== undefined)
    );
    console.log('🏗️ [buildEventoDTO] organizacionesExternas after filter:', organizacionesExternas);
    
    const participacionesOrganizaciones = (organizacionesExternas || []).map(org => {
      const idOrg = (org as any).id || org.idOrganizacion;
      console.log('🏗️ [buildEventoDTO] Processing org:', org, 'idOrg:', idOrg);
      let orgData = {
        participaRepresentante: false,
        nombreRepresentante: '',
        cedulaRepresentante: '',
        avalFilePath: '',
        avalFileName: ''
      };
      if (this.selectedOrganizationsComponent) {
        orgData = this.selectedOrganizationsComponent.getOrganizationDataById(idOrg);
        console.log('🏗️ [buildEventoDTO] orgData from component:', orgData);
      } else {
        console.warn('⚠️ [buildEventoDTO] selectedOrganizationsComponent is null/undefined');
      }
      const result = {
        idOrganizacion: idOrg,
        nombreOrganizacion: org.nombre || '',
        certificadoPdf: orgData.avalFilePath || `certificado_org${idOrg}.pdf`,
        representanteDiferente: !orgData.participaRepresentante,
        nombreRepresentanteDiferente: orgData.participaRepresentante ? undefined : orgData.nombreRepresentante
      };
      console.log('🏗️ [buildEventoDTO] participacion result:', result);
      return result;
    });

    console.log('🏗️ [buildEventoDTO] FINAL participacionesOrganizaciones:', participacionesOrganizaciones);

    return {
      titulo: form.get('eventName')?.value?.trim() || '',
      tipoEvento: form.get('eventType')?.value === 'academico' ? 'Académico' : 'Lúdico',
      fecha: form.get('eventDate')?.value || '',
      instalaciones: instalaciones,
      capacidad: this.eventCapacity,
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
    const encountersValid = this.encounters.every(e => e.startTime && e.endTime && e.location);
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

  validateCapacity(): boolean {
    // Si no se especificó capacidad, permitir continuar (campo opcional)
    if (!this.eventCapacity || this.eventCapacity <= 0) {
      return true;
    }

    // Obtener instalaciones únicas seleccionadas
    const selectedLocations = this.encounters
      .filter(e => e.location !== null)
      .map(e => e.location);
    
    // Usar un Set para obtener instalaciones únicas por ID
    const uniqueLocations = Array.from(
      new Map(selectedLocations.map(loc => [loc!.idInstalacion, loc])).values()
    );

    // Calcular capacidad total
    const totalCapacity = uniqueLocations.reduce((sum, loc) => sum + (loc?.capacidad || 0), 0);

    // Validar que la capacidad total sea suficiente
    if (totalCapacity < this.eventCapacity) {
      notyf.error(
        `Capacidad insuficiente: ${totalCapacity}/${this.eventCapacity} personas. Seleccione más instalaciones.`
      );
      return false;
    }

    return true;
  }

  onCapacityChange(): void {
    // Validar automáticamente cuando cambia la capacidad
    if (this.eventCapacity && this.eventCapacity > 0 && this.encounters.some(e => e.location !== null)) {
      this.validateCapacity();
    }
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

