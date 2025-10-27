import { Component, OnInit } from '@angular/core';
import { EventosApiService, EventoDTO } from '../services/eventos.api.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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

  constructor(
    private eventosApiService: EventosApiService,
    private authService: AuthService,
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
    // Determinar el estado del evento basado en la información disponible
    // Si el evento tiene una evaluación, usar su estado
    // Si no, asumir que es borrador
    let estado: 'Borrador' | 'Pendiente' | 'Aprobado' | 'Rechazado' = 'Borrador';
    
    // Aquí puedes agregar lógica adicional para determinar el estado real
    // basado en campos del evento o llamadas adicionales a la API
    // Por ejemplo, si el evento tiene un campo 'estado' o 'evaluacion'
    
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

  sendToValidation(evento: EventoDTO): void {
    if (!evento.idEvento) return;

    const confirmSend = confirm(`¿Deseas enviar el evento "${evento.titulo}" a validación?`);
    if (!confirmSend) return;

    this.eventosApiService.sendToValidation(evento.idEvento).subscribe({
      next: () => {
        // Actualizar estado localmente
        evento.estado = 'Pendiente';
        this.filterEventsByStatus();
        alert('El evento ha sido enviado a validación correctamente.');
      },
      error: (err) => {
        console.error('Error enviando a validación:', err);
        alert('No se pudo enviar el evento a validación. Revisa la consola.');
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

        alert('Evento eliminado exitosamente');
      },
      error: (error) => {
        console.error('Error eliminando evento:', error);
        alert('Error al eliminar el evento');
      }
    });
  }

  canEdit(evento: EventoDTO): boolean {
    return evento.estado === 'Borrador' || evento.estado === 'Rechazado';
  }

  canDelete(evento: EventoDTO): boolean {
    return evento.estado === 'Borrador';
  }

  canSendToValidation(evento: EventoDTO): boolean {
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