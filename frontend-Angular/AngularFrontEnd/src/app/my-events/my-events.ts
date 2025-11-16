import { Component, OnInit } from '@angular/core';
import { EventosApiService, EventoDTO } from '../services/eventos.api.service';
import { AuthService } from '../services/auth.service';
import { EvaluacionesApiService, EvaluacionResponse } from '../services/evaluaciones.api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { notyf } from '../app'; 



@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.html',
  styleUrls: ['./my-events.css'],
  imports: [FormsModule, CommonModule, RouterModule],
  standalone: true
})

export class MyEventsComponent implements OnInit {

  // events: EventoConEstado[] = []; 💢
  events: EventoDTO[] = [];
  filteredEvents: EventoDTO[] = [];
  draftEvents: EventoDTO[] = [];
  rejectedEvents: EventoDTO[] = [];
  approvedEvents: EventoDTO[] = [];
  pendingEvents: EventoDTO[] = [];
  loading = false;
  error: string | null = null;
  
  // Filtros
  filterEstado: string = '';
  filterNombre: string = '';
  filterFecha: string = '';
  showFilters: boolean = false;

  // Modal de confirmación para enviar a validación
  showConfirmModal: boolean = false;
  eventToSend: EventoDTO | null = null;

  // Modal para ver justificación de rechazo
  showJustificacionModal: boolean = false;
  justificacionTexto: string = '';

  // Modal para ver acta de aprobación
  showActaModal: boolean = false;
  actaUrl: SafeResourceUrl | null = null;
  actaUrlOriginal: string = ''; // Para descargas
  loadingEvaluacion: boolean = false;

  constructor(
    private eventosApiService: EventosApiService,
    private authService: AuthService,
    private evaluacionesApi: EvaluacionesApiService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}
  currentUser: any = null;
  ngOnInit(): void {
    this.loadEvents(),
    this.authService.getUserProfile().subscribe({
      next: (user) => {
        if (!user || user.tipoUsuario == 'Secretaria') {
          notyf.error("Secretaria no tiene eventos asociados");
          this.router.navigate(['/home']);
        }
      },
      error: (err) => console.error('Error al obtener el perfil del usuario', err)
    });
  }
  get isSecretaria(): boolean { return this.currentUser?.tipoUsuario === 'Secretaria'; }

  loadEvents(): void {
    this.loading = true;
    this.error = null;

    // <<solo para el evento de ejemplo>>
    // Se comenta la carga real de eventos para permitir la visualización del ejemplo estático.
     this.authService.getUserProfile().subscribe({
       next: (userProfile) => {
         const idUsuario = userProfile.idUsuario;
         this.eventosApiService.getByOrganizador(idUsuario).subscribe({
           next: (eventos) => {
             this.events = eventos.map(evento => this.mapEventoWithEstado(evento));
            this.filteredEvents = [...this.events];
             this.filterEventsByStatus();
             this.loading = false;
           },
           error: (error) => {
             console.error('Error cargando eventos:', error);
             this.error = 'Error al cargar los eventos';
            this.loading = false;
           }
         });
       },
       error: (error) => {
         console.error('Error obteniendo perfil de usuario:', error);
         this.error = 'Error al obtener información del usuario';
         this.loading = false;
      }
     });
    this.loading = false; // Forzar a que no se muestre "cargando"
    // <<solo para el evento de ejemplo>>
  }

  private mapEventoWithEstado(evento: EventoDTO): EventoDTO {
    // Usar el estado que viene del backend, o 'Borrador' por defecto
    const estado: 'Borrador' | 'Pendiente' | 'Aprobado' | 'Rechazado' = 
      (evento.estado as 'Borrador' | 'Pendiente' | 'Aprobado' | 'Rechazado') || 'Borrador';
    
    return {
      ...evento,
      estado: estado
    };
  }

  filterEventsByStatus(): void {
    this.draftEvents = this.filteredEvents.filter(e => e.estado === 'Borrador');
    this.pendingEvents = this.filteredEvents.filter(e => e.estado === 'Pendiente');
    this.rejectedEvents = this.filteredEvents.filter(e => e.estado === 'Rechazado');
    this.approvedEvents = this.filteredEvents.filter(e => e.estado === 'Aprobado');
  }
  
  applyFilters(): void {
    this.filteredEvents = this.events.filter(evento => {
      const matchesEstado = !this.filterEstado || evento.estado === this.filterEstado;
      const matchesNombre = !this.filterNombre || 
        evento.titulo.toLowerCase().includes(this.filterNombre.toLowerCase());
      const matchesFecha = !this.filterFecha || evento.fecha === this.filterFecha;
      
      return matchesEstado && matchesNombre && matchesFecha;
    });
    
    this.filterEventsByStatus();
  }
  
  clearFilters(): void {
    this.filterEstado = '';
    this.filterNombre = '';
    this.filterFecha = '';
    this.filteredEvents = [...this.events];
    this.filterEventsByStatus();
  }
  
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  openConfirmModal(evento: EventoDTO): void {
    this.eventToSend = evento;
    this.showConfirmModal = true;
  }

  cancelSend(): void {
    this.showConfirmModal = false;
    this.eventToSend = null;
  }

  confirmSend(): void {
    if (!this.eventToSend || !this.eventToSend.idEvento) {
      this.cancelSend();
      return;
    }

    const target = this.eventToSend;
    const id = target.idEvento as number;
    this.eventosApiService.sendToValidation(id).subscribe({
      next: () => {
        target.estado = 'Pendiente';
        this.filterEventsByStatus();
        this.cancelSend();
        notyf.success('El evento ha sido enviado a validación correctamente.');
      },
      error: (err) => {
        console.error('Error enviando a validación:', err);
        this.cancelSend();
        if (!(err && (err as any)._notyfHandled)) {
          notyf.error('No se pudo enviar el evento a validación. Revisa la consola.');
        }
      }
    });
  }

  editEvent(evento: EventoDTO): void {
    if (!evento.idEvento) return;
    // Navegar a la ruta de edición con el id en la ruta (definida en app.routes.ts)
    this.router.navigate(['/eventos/editar', evento.idEvento]);
  }

  deleteEvent(evento: EventoDTO): void {
    if (!evento.idEvento) return;
    
    const confirmDelete = confirm(`¿Estás seguro de que quieres eliminar el evento "${evento.titulo}"?`);
    if (!confirmDelete) return;
    
    this.eventosApiService.delete(evento.idEvento).subscribe({
      next: () => {
        // Remover el evento de las listas locales para respuesta inmediata
        this.events = this.events.filter(e => e.idEvento !== evento.idEvento);
        this.filteredEvents = this.filteredEvents.filter(e => e.idEvento !== evento.idEvento);
        // Actualizar las listas por estado
        this.filterEventsByStatus();

        // También recargar desde el backend para asegurar sincronía
        this.loadEvents();

        notyf.success('Evento eliminado exitosamente');
      },
      error: (error) => {
        console.error('Error eliminando evento:', error);
        if (!(error && (error as any)._notyfHandled)) {
          notyf.error('Error al eliminar el evento');
        }
      }
    });
  }

  canEdit(evento: EventoDTO): boolean {
    return evento.estado === 'Borrador' || evento.estado === 'Rechazado';
  }

  canDelete(evento: EventoDTO): boolean {
    return evento.estado === 'Borrador' || evento.estado === 'Rechazado';
  }

  canSendToValidation(evento: EventoDTO): boolean {
    return evento.estado === 'Borrador' || evento.estado === 'Rechazado';
  }

  getEstadoBadgeClass(estado: string): string {
    switch (estado) {
      case 'Borrador': return 'status-badge draft';
      case 'Pendiente': return 'status-badge pending';
      case 'Aprobado': return 'status-badge approved';
      case 'Rechazado': return 'status-badge rejected';
      default: return 'status-badge draft';
    }
  }

  getEstadoCardClass(estado: string): string {
    switch (estado) {
      case 'Borrador': return 'event-card draft';
      case 'Pendiente': return 'event-card pending';
      case 'Aprobado': return 'event-card approved';
      case 'Rechazado': return 'event-card rejected';
      default: return 'event-card draft';
    }
  }

  verJustificacion(evento: EventoDTO): void {
    if (!evento.idEvento) return;
    
    this.loadingEvaluacion = true;
    this.evaluacionesApi.getByEvento(evento.idEvento).subscribe({
      next: (evaluaciones) => {
        this.loadingEvaluacion = false;
        if (evaluaciones && evaluaciones.length > 0) {
          // Tomar la primera evaluación (o la más reciente)
          const evaluacion = evaluaciones[0];
          this.justificacionTexto = evaluacion.justificacion || 'No se proporcionó justificación.';
          this.showJustificacionModal = true;
        } else {
          notyf.error('No se encontró la evaluación para este evento.');
        }
      },
      error: (err) => {
        this.loadingEvaluacion = false;
        console.error('Error al obtener evaluación:', err);
        notyf.error('Error al cargar la justificación del rechazo.');
      }
    });
  }

  closeJustificacionModal(): void {
    this.showJustificacionModal = false;
    this.justificacionTexto = '';
  }

  verActa(evento: EventoDTO): void {
    if (!evento.idEvento) return;
    
    this.loadingEvaluacion = true;
    this.evaluacionesApi.getByEvento(evento.idEvento).subscribe({
      next: (evaluaciones) => {
        this.loadingEvaluacion = false;
        if (evaluaciones && evaluaciones.length > 0) {
          const evaluacion = evaluaciones[0];
          if (evaluacion.actaPdf) {
            // Guardar URL original para descargas
            this.actaUrlOriginal = evaluacion.actaPdf;
            // El actaPdf es el path del archivo, sanitizarlo para el iframe
            this.actaUrl = this.sanitizer.bypassSecurityTrustResourceUrl(evaluacion.actaPdf);
            this.showActaModal = true;
          } else {
            notyf.error('No se encontró el acta para este evento.');
          }
        } else {
          notyf.error('No se encontró la evaluación para este evento.');
        }
      },
      error: (err) => {
        this.loadingEvaluacion = false;
        console.error('Error al obtener evaluación:', err);
        notyf.error('Error al cargar el acta de aprobación.');
      }
    });
  }

  closeActaModal(): void {
    this.showActaModal = false;
    this.actaUrl = null;
    this.actaUrlOriginal = '';
  }

  descargarActa(): void {
    if (!this.actaUrlOriginal) return;
    
    // Crear un link temporal para descargar
    const link = document.createElement('a');
    link.href = this.actaUrlOriginal;
    link.download = this.actaUrlOriginal.split('/').pop() || 'acta.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}