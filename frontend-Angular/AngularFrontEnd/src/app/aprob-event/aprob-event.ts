import { Component, OnInit } from '@angular/core';
import { EventosApiService, EventoDTO } from '../services/eventos.api.service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Notyf } from 'notyf';
import { notyf } from '../app'; 


@Component({
  selector: 'app-aprob-event',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './aprob-event.html',
  styleUrl: './aprob-event.css'
})
export class AprobEvent implements OnInit {
  
    // events: EventoConEstado[] = []; 💢
    events: EventoDTO[] = [
      {
    titulo: "Foro de Tecnología 2025",
    tipoEvento: "Académico",
    fecha: "2025-11-15",
    horaInicio: "09:00:00",
    horaFin: "13:00:00",
    idOrganizador: 1,
    instalaciones: [2, 5],
    coorganizadores: [3, 4],
    participacionesOrganizaciones: [
      {
        idOrganizacion: 7,
        certificadoPdf: "JVBERi0xLjQKJcfsj6IK...", // Base64 del certificado
        representanteDiferente: true,
        nombreRepresentanteDiferente: "María López"
      },
      {
        idOrganizacion: 9,
        certificadoPdf: "JVBERi0xLjQKJcfsj6IK...",
        representanteDiferente: false
      }
    ],
  
    avalPdf: "JVBERi0xLjQKJcfsj6IK...",
    tipoAval: "Director_Docencia",
    estado: "Pendiente"
  }
    ];
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
      ) 
      {}
  
    ngOnInit(): void {
      this.loadEvents();
      this.authService.getUserProfile().subscribe({
      next: (user) => {
        if (!user || user.tipoUsuario !== 'Secretaria') {
          notyf.error("No eres secretaria, no puedes calificar eventos");
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.router.navigate(['/home']);
      }
    });
    }
  
    loadEvents(): void {
      this.loading = true;
      this.error = null;
  
      // <<solo para el evento de ejemplo>>
      // Se comenta la carga real de eventos para permitir la visualización del ejemplo estático.
      // this.authService.getUserProfile().subscribe({
      //   next: (userProfile) => {
      //     const idUsuario = userProfile.idUsuario;
      //     this.eventosApiService.getByOrganizador(idUsuario).subscribe({
      //       next: (eventos) => {
      //         this.events = eventos.map(evento => this.mapEventoWithEstado(evento));
      //         this.filteredEvents = [...this.events];
      //         this.filterEventsByStatus();
      //         this.loading = false;
      //       },
      //       error: (error) => {
      //         console.error('Error cargando eventos:', error);
      //         this.error = 'Error al cargar los eventos';
      //         this.loading = false;
      //       }
      //     });
      //   },
      //   error: (error) => {
      //     console.error('Error obteniendo perfil de usuario:', error);
      //     this.error = 'Error al obtener información del usuario';
      //     this.loading = false;
      //   }
      // });
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
  
    editEvent(evento: EventoDTO): void {
      if (!evento.idEvento) return;
      
      // Navegar a la página de edición con el ID del evento
      this.router.navigate(['/add-event'], { 
        queryParams: { edit: true, id: evento.idEvento } 
      });
    }
  
    deleteEvent(evento: EventoDTO): void {
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
