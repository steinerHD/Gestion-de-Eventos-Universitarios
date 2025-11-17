import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { EventosApiService, EventoDTO, ParticipacionDetalleDTO, EventoOrganizadorResponse } from '../services/eventos.api.service';
import { EvaluacionesApiService, EvaluacionRequest } from '../services/evaluaciones.api.service';
import { AuthService } from '../services/auth.service';
import { API_BASE_URL } from '../config/api.config';
import { OrganizacionesApiService, OrganizacionExternaDTO } from '../services/organizaciones.api.service';
import { InstalacionesApiService, InstalacionDTO } from '../services/instalaciones.api.service';
import { UsuariosApiService, UsuarioDTO } from '../services/usuarios.api.service';
import { notyf } from '../app';


// Extiende UsuarioDTO con posibles formas anidadas que la API puede devolver
type OrganizerExtended = UsuarioDTO & {
  estudiante?: {
    codigoEstudiantil?: string;
    programa?: string;
  };
  docente?: {
    cargo?: string;
    facultad?: string;
    unidadAcademica?: string;
  };
};

// Organizador con su información completa y aval
interface OrganizadorDetallado {
  usuario: OrganizerExtended | null;
  avalPdf: string;
  tipoAval: string;
  rol: string;
}

@Component({
  selector: 'app-detalle-aprob-event',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './detalle-aprob-event.html',
  styleUrls: ['./detalle-aprob-event.css']
})
export class DetalleAprobEvent implements OnInit {
  evento: EventoDTO | null = null;
  instalacionesList: InstalacionDTO[] = [];
  coorganizadoresList: string[] = [];
  organizerInfo: OrganizerExtended | null = null;
  organizadoresDetallados: OrganizadorDetallado[] = [];
  participacionesDetailed: Array<{ original: ParticipacionDetalleDTO; org?: OrganizacionExternaDTO | null }> = [];
  loading = false;
  error: string | null = null;
  
  // Evaluación
  currentUser: any = null;
  showApproveModal = false;
  showRejectModal = false;
  actaFile: File | null = null;
  actaFileName: string = '';
  justificacion: string = '';
  submittingEvaluation = false;

  constructor(
    private route: ActivatedRoute,
    private eventosApi: EventosApiService,
    private evaluacionesApi: EvaluacionesApiService,
    private authService: AuthService,
    private instalacionesApi: InstalacionesApiService,
    private usuariosApi: UsuariosApiService,
    private router: Router,
    private organizacionesApi: OrganizacionesApiService,
    private cdr: ChangeDetectorRef
  ) {}

  // Formatea horarios de instalaciones para mostrar
  formatTimeSlots(evento: EventoDTO): string {
    if (!evento.instalaciones || evento.instalaciones.length === 0) {
      return 'Sin horarios';
    }
    return evento.instalaciones
      .map(inst => {
        const horaInicio = inst.horaInicio?.substring(0, 5) || '--:--';
        const horaFin = inst.horaFin?.substring(0, 5) || '--:--';
        const nombre = inst.nombreInstalacion || `Instalación ${inst.idInstalacion}`;
        return `${horaInicio}-${horaFin} (${nombre})`;
      })
      .join(', ');
  }

  ngOnInit(): void {
    // Cargar usuario actual
    this.authService.getUserProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (err) => console.error('Error al obtener perfil:', err)
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.error = 'ID de evento no proporcionado';
      return;
    }
    const id = Number(idParam);
    if (isNaN(id)) {
      this.error = 'ID de evento inválido';
      return;
    }

    this.loadEvento(id);
  }

  loadEvento(id: number): void {
    this.loading = true;
    this.eventosApi.getById(id).subscribe({
      next: (e) => {
        this.evento = e;
        // Las instalaciones ya vienen completas en el evento, no necesitamos cargarlas
        this.instalacionesList = [];
        
        // Cargar nombres de coorganizadores
        this.coorganizadoresList = [];
        (e.coorganizadores || []).forEach((uId) => {
          this.usuariosApi.getById(uId).subscribe({
            next: (u) => {
              this.coorganizadoresList.push(u.nombre + ' <' + u.correo + '>');
              this.cdr.detectChanges();
            },
            error: (err) => {
              console.warn('No se pudo cargar coorganizador id=', uId, err);
            }
          });
        });

        // Cargar información del organizador completo
        this.organizerInfo = null;
        if (e.idOrganizador) {
          this.usuariosApi.getById(e.idOrganizador).subscribe({
            next: (u) => {
              this.organizerInfo = u;
              this.cdr.detectChanges();
              console.log('Organizador cargado:', u);
            },
            error: (err) => {
              console.warn('No se pudo cargar organizador id=', e.idOrganizador, err);
            }
          });
        }

        // Cargar información detallada de todos los organizadores con sus avales
        this.organizadoresDetallados = [];
        (e.organizadores || []).forEach((org) => {
          const entry: OrganizadorDetallado = {
            usuario: null,
            avalPdf: org.avalPdf || '',
            tipoAval: org.tipoAval || '',
            rol: org.rol || ''
          };
          this.organizadoresDetallados.push(entry);
          
          if (org.idUsuario) {
            this.usuariosApi.getById(org.idUsuario).subscribe({
              next: (u) => {
                entry.usuario = u;
                this.cdr.detectChanges();
              },
              error: (err) => {
                console.warn('No se pudo cargar usuario organizador id=', org.idUsuario, err);
              }
            });
          }
        });

        // Cargar detalles de participaciones (organización y certificado ya presente en original)
        this.participacionesDetailed = [];
        (e.participacionesOrganizaciones || []).forEach((p) => {
          const entry = { original: p, org: null as OrganizacionExternaDTO | null };
          this.participacionesDetailed.push(entry);
          if (p.idOrganizacion) {
            this.organizacionesApi.getById(p.idOrganizacion).subscribe({
              next: (org) => {
                entry.org = org;
                this.cdr.detectChanges();
              },
              error: (err) => {
                console.warn('No se pudo cargar organización externa id=', p.idOrganizacion, err);
              }
            });
          }
        });

        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando evento detalle:', err);
        this.error = 'No se pudo cargar el evento.';
        this.loading = false;
      }
    });
  }

  back(): void {
    this.router.navigate(['/aprobar-eventos']);
  }

  openPdf(url?: string | null): void {
    if (!url) return;
    try {
      // If the URL is a relative assets path (starts with 'assets/'), prepend backend base URL
      const finalUrl = url.startsWith('http') ? url : `${API_BASE_URL}/${url}`;
      window.open(finalUrl, '_blank');
    } catch (err) {
      console.error('No se pudo abrir el PDF:', err);
    }
  }

  // Métodos de evaluación
  openApproveModal(): void {
    if (!this.evento || this.evento.estado !== 'Pendiente') {
      notyf.error('Solo se pueden aprobar eventos en estado Pendiente');
      return;
    }
    this.showApproveModal = true;
    this.actaFile = null;
    this.actaFileName = '';
  }

  openRejectModal(): void {
    if (!this.evento || this.evento.estado !== 'Pendiente') {
      notyf.error('Solo se pueden rechazar eventos en estado Pendiente');
      return;
    }
    this.showRejectModal = true;
    this.justificacion = '';
  }

  closeApproveModal(): void {
    this.showApproveModal = false;
    this.actaFile = null;
    this.actaFileName = '';
  }

  closeRejectModal(): void {
    this.showRejectModal = false;
    this.justificacion = '';
  }

  onActaFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      // Validar que sea PDF
      if (file.type !== 'application/pdf') {
        notyf.error('Solo se permiten archivos PDF');
        event.target.value = '';
        return;
      }
      // Validar tamaño (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        notyf.error('El archivo no debe superar 10MB');
        event.target.value = '';
        return;
      }
      this.actaFile = file;
      this.actaFileName = file.name;
    }
  }

  aprobarEvento(): void {
    if (!this.actaFile) {
      notyf.error('Debe adjuntar el acta del comité en formato PDF');
      return;
    }

    if (!this.currentUser || !this.currentUser.idSecretaria) {
      notyf.error('No se pudo identificar la secretaría');
      return;
    }

    if (!this.evento || !this.evento.idEvento) {
      notyf.error('No se pudo identificar el evento');
      return;
    }

    this.submittingEvaluation = true;

    // Primero subir el acta
    this.evaluacionesApi.uploadActa(this.actaFile).subscribe({
      next: (response) => {
        // Crear la evaluación con el path del acta
        const evaluacionRequest: EvaluacionRequest = {
          estado: 'Aprobado',
          actaPdf: response.path,
          idEvento: this.evento!.idEvento!,
          idSecretaria: this.currentUser.idSecretaria,
          fecha: new Date().toISOString().split('T')[0]
        };

        this.evaluacionesApi.create(evaluacionRequest).subscribe({
          next: () => {
            notyf.success('Evento aprobado exitosamente');
            this.submittingEvaluation = false;
            this.closeApproveModal();
            // Volver a la lista de eventos
            this.router.navigate(['/aprobar-eventos']);
          },
          error: (err) => {
            console.error('Error al crear evaluación:', err);
            notyf.error('Error al aprobar el evento');
            this.submittingEvaluation = false;
          }
        });
      },
      error: (err) => {
        console.error('Error al subir acta:', err);
        notyf.error('Error al subir el acta. Intenta nuevamente.');
        this.submittingEvaluation = false;
      }
    });
  }

  rechazarEvento(): void {
    if (!this.justificacion || this.justificacion.trim() === '') {
      notyf.error('Debe indicar una justificación para rechazar el evento');
      return;
    }

    if (!this.currentUser || !this.currentUser.idSecretaria) {
      notyf.error('No se pudo identificar la secretaría');
      return;
    }

    if (!this.evento || !this.evento.idEvento) {
      notyf.error('No se pudo identificar el evento');
      return;
    }

    this.submittingEvaluation = true;

    const evaluacionRequest: EvaluacionRequest = {
      estado: 'Rechazado',
      justificacion: this.justificacion.trim(),
      idEvento: this.evento.idEvento,
      idSecretaria: this.currentUser.idSecretaria,
      fecha: new Date().toISOString().split('T')[0]
    };

    this.evaluacionesApi.create(evaluacionRequest).subscribe({
      next: () => {
        notyf.success('Evento rechazado');
        this.submittingEvaluation = false;
        this.closeRejectModal();
        // Volver a la lista de eventos
        this.router.navigate(['/aprobar-eventos']);
      },
      error: (err) => {
        console.error('Error al crear evaluación:', err);
        notyf.error('Error al rechazar el evento');
        this.submittingEvaluation = false;
      }
    });
  }

  canEvaluate(): boolean {
    return this.evento?.estado === 'Pendiente' && 
           this.currentUser?.tipoUsuario === 'Secretaria';
  }
}
