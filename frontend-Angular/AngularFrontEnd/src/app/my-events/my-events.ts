import { Component, OnInit } from '@angular/core';
import { EventosApiService, EventoDTO } from '../services/eventos.api.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface EventoConEstado extends EventoDTO {
  estado: 'Borrador' | 'Pendiente' | 'Aprobado' | 'Rechazado';
  evaluacion?: any;
}

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.html',
  styleUrls: ['./my-events.css'],
  imports: [FormsModule, CommonModule, RouterModule],
  standalone: true
})

export class MyEventsComponent implements OnInit {

  events: EventoConEstado[] = [];
  draftEvents: EventoConEstado[] = [];
  rejectedEvents: EventoConEstado[] = [];
  approvedEvents: EventoConEstado[] = [];
  pendingEvents: EventoConEstado[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private eventosApiService: EventosApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.error = null;
    
    this.authService.getUserProfile().subscribe({
      next: (userProfile) => {
        const idUsuario = userProfile.idUsuario;
        this.eventosApiService.getByOrganizador(idUsuario).subscribe({
          next: (eventos) => {
            this.events = eventos.map(evento => this.mapEventoWithEstado(evento));
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
  }

  private mapEventoWithEstado(evento: EventoDTO): EventoConEstado {
    // Por ahora, todos los eventos se consideran "Borrador" hasta que se implemente
    // la lógica de evaluación en el backend
    return {
      ...evento,
      estado: 'Borrador' as const
    };
  }

  filterEventsByStatus(): void {
    this.draftEvents = this.events.filter(e => e.estado === 'Borrador');
    this.pendingEvents = this.events.filter(e => e.estado === 'Pendiente');
    this.rejectedEvents = this.events.filter(e => e.estado === 'Rechazado');
    this.approvedEvents = this.events.filter(e => e.estado === 'Aprobado');
  }

  sendToValidation(evento: EventoConEstado): void {
    if (!evento.idEvento) return;
    
    this.eventosApiService.sendToValidation(evento.idEvento).subscribe({
      next: () => {
        // Actualizar el estado del evento localmente
        evento.estado = 'Pendiente';
        this.filterEventsByStatus();
        alert('Evento enviado a validación exitosamente');
      },
      error: (error) => {
        console.error('Error enviando a validación:', error);
        alert('Error al enviar el evento a validación');
      }
    });
  }

  editEvent(evento: EventoConEstado): void {
    if (!evento.idEvento) return;
    
    // Navegar a la página de edición con el ID del evento
    this.router.navigate(['/add-event'], { 
      queryParams: { edit: true, id: evento.idEvento } 
    });
  }

  deleteEvent(evento: EventoConEstado): void {
    if (!evento.idEvento) return;
    
    const confirmDelete = confirm(`¿Estás seguro de que quieres eliminar el evento "${evento.titulo}"?`);
    if (!confirmDelete) return;
    
    this.eventosApiService.delete(evento.idEvento).subscribe({
      next: () => {
        // Remover el evento de la lista local
        this.events = this.events.filter(e => e.idEvento !== evento.idEvento);
        this.filterEventsByStatus();
        alert('Evento eliminado exitosamente');
      },
      error: (error) => {
        console.error('Error eliminando evento:', error);
        alert('Error al eliminar el evento');
      }
    });
  }

  canEdit(evento: EventoConEstado): boolean {
    return evento.estado === 'Borrador' || evento.estado === 'Rechazado';
  }

  canDelete(evento: EventoConEstado): boolean {
    return evento.estado === 'Borrador';
  }

  canSendToValidation(evento: EventoConEstado): boolean {
    return evento.estado === 'Borrador';
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
}