import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventosApiService, EventoDTO } from '../services/eventos.api.service';
import { AuthService } from '../services/auth.service';
import { NotificacionesApiService, NotificacionResponse } from '../services/notificaciones.api.service';
import { notyf } from '../app'; 


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  events: EventoDTO[] = [];
  currentUser: any = null;
  
  notificaciones: NotificacionResponse[] = [];
  notificacionesNoLeidas: number = 0;
  showNotificaciones: boolean = false;

  constructor(
    private eventosApiService: EventosApiService,
    private authService: AuthService,
    private notificacionesApi: NotificacionesApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    this.authService.getUserProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        if (user && user.idUsuario) {
          this.loadNotificaciones();
        }
      },
      error: (err) => console.error('Error al obtener el perfil del usuario', err)
    });
  }

  get isSecretaria(): boolean { return this.currentUser?.tipoUsuario === 'Secretaria'; }

  loadEvents(): void {
    this.eventosApiService.getAll().subscribe({
      next: (events) => {
        this.events = events;
        console.log('Eventos cargados:', events);
      },
      error: (error: Error) => notyf.error('Error al cargar eventos:'+ error)
    });
  }

  searchEvents(query: string): void {
    if (!query || query.trim() === '') {
      this.loadEvents();
      return;
    }
    
    this.eventosApiService.getByTitulo(query).subscribe({
      next: (events) => this.events = events,
      error: (error: Error) => notyf.error('Error al buscar eventos'+ error)
    });
  }
  
  loadNotificaciones(): void {
    if (!this.currentUser || !this.currentUser.idUsuario) return;
    
    this.notificacionesApi.getNoLeidasByUsuario(this.currentUser.idUsuario).subscribe({
      next: (notificaciones) => {
        this.notificaciones = notificaciones;
        this.notificacionesNoLeidas = notificaciones.length;
      },
      error: (err) => console.error('Error al cargar notificaciones:', err)
    });
  }
  
  toggleNotificaciones(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.showNotificaciones = !this.showNotificaciones;
  }
  
  marcarComoLeida(notificacion: NotificacionResponse): void {
    if (!notificacion.leida) {
      this.notificacionesApi.marcarComoLeida(notificacion.idNotificacion).subscribe({
        next: () => {
          notificacion.leida = true;
          this.notificacionesNoLeidas = Math.max(0, this.notificacionesNoLeidas - 1);
        },
        error: (err) => console.error('Error al marcar notificación:', err)
      });
    }
    
    // Redirigir según el tipo de usuario
    this.cerrarNotificaciones();
    
    if (this.currentUser?.tipoUsuario === 'Secretaria') {
      this.router.navigate(['/aprobar-eventos']);
    } else if (this.currentUser?.tipoUsuario === 'Docente' || this.currentUser?.tipoUsuario === 'Estudiante') {
      this.router.navigate(['/my-events']);
    }
  }
  
  cerrarNotificaciones(): void {
    this.showNotificaciones = false;
  }
}
