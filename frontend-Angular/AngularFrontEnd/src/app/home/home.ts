import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { EventosApiService, EventoDTO } from '../services/eventos.api.service';
import { AuthService } from '../services/auth.service';
import { NotificacionesApiService, NotificacionResponse } from '../services/notificaciones.api.service';
import { UsuariosApiService, UsuarioDTO } from '../services/usuarios.api.service';
import { OrganizacionesApiService, OrganizacionExternaDTO } from '../services/organizaciones.api.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { notyf } from '../app'; 

// Registrar locale español
registerLocaleData(localeEs);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, DatePipe],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }]
})
export class HomeComponent implements OnInit {
  events: EventoDTO[] = [];
  currentUser: any = null;
  usuariosMap: Map<number, UsuarioDTO> = new Map(); // Cache de usuarios
  organizacionesMap: Map<number, OrganizacionExternaDTO> = new Map(); // Cache de organizaciones
  
  notificaciones: NotificacionResponse[] = [];
  notificacionesNoLeidas: number = 0;
  showNotificaciones: boolean = false;

  constructor(
    private eventosApiService: EventosApiService,
    private authService: AuthService,
    private notificacionesApi: NotificacionesApiService,
    private usuariosService: UsuariosApiService,
    private organizacionesService: OrganizacionesApiService,
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
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Resetear horas para comparar solo fechas
        
        // Filtrar solo eventos aprobados y que no hayan pasado
        this.events = events.filter(event => {
          const isApproved = event.estado === 'Aprobado';
          
          // Verificar si la fecha del evento no ha pasado
          const eventDate = new Date(event.fecha);
          eventDate.setHours(0, 0, 0, 0);
          const isNotPast = eventDate >= today;
          
          return isApproved && isNotPast;
        });
        
        console.log('Eventos aprobados y vigentes cargados:', this.events);
        
        // Cargar información de todos los organizadores y organizaciones externas
        this.loadOrganizadoresData();
        this.loadOrganizacionesExternasData();
      },
      error: (error: Error) => notyf.error('Error al cargar eventos:'+ error)
    });
  }

  loadOrganizadoresData(): void {
    // Recopilar todos los IDs de usuarios únicos de los organizadores
    const usuarioIds = new Set<number>();
    
    this.events.forEach(event => {
      if (event.organizadores) {
        event.organizadores.forEach(org => {
          if (org.idUsuario) {
            usuarioIds.add(org.idUsuario);
          }
        });
      }
    });

    // Cargar datos de todos los usuarios en paralelo
    if (usuarioIds.size > 0) {
      const usuarioRequests = Array.from(usuarioIds).map(id => 
        this.usuariosService.getById(id)
      );

      forkJoin(usuarioRequests).subscribe({
        next: (usuarios) => {
          // Guardar usuarios en el mapa para acceso rápido
          usuarios.forEach(usuario => {
            this.usuariosMap.set(usuario.idUsuario, usuario);
          });
          console.log('Datos de usuarios cargados:', this.usuariosMap);
        },
        error: (err) => console.error('Error al cargar datos de usuarios:', err)
      });
    }
  }

  getUsuarioNombre(idUsuario: number): string {
    return this.usuariosMap.get(idUsuario)?.nombre || 'Cargando...';
  }

  getUsuarioCorreo(idUsuario: number): string {
    return this.usuariosMap.get(idUsuario)?.correo || '';
  }

  getUsuarioPrograma(idUsuario: number): string | undefined {
    return this.usuariosMap.get(idUsuario)?.programa;
  }

  getUsuarioUnidadAcademica(idUsuario: number): string | undefined {
    return this.usuariosMap.get(idUsuario)?.unidadAcademica;
  }

  loadOrganizacionesExternasData(): void {
    // Recopilar todos los IDs de organizaciones únicas
    const organizacionIds = new Set<number>();
    
    this.events.forEach(event => {
      console.log('Evento:', event.titulo, 'Participaciones:', event.participacionesOrganizaciones);
      if (event.participacionesOrganizaciones) {
        event.participacionesOrganizaciones.forEach(participacion => {
          if (participacion.idOrganizacion) {
            organizacionIds.add(participacion.idOrganizacion);
          }
        });
      }
    });

    console.log('IDs de organizaciones a cargar:', Array.from(organizacionIds));

    // Cargar datos de todas las organizaciones en paralelo
    if (organizacionIds.size > 0) {
      const organizacionRequests = Array.from(organizacionIds).map(id => 
        this.organizacionesService.getById(id).pipe(
          catchError(err => {
            console.error(`Error al cargar organización ${id}:`, err);
            return of(null);
          })
        )
      );

      forkJoin(organizacionRequests).subscribe({
        next: (organizaciones) => {
          // Guardar organizaciones en el mapa para acceso rápido
          organizaciones.forEach(organizacion => {
            if (organizacion && organizacion.id) {
              this.organizacionesMap.set(organizacion.id, organizacion);
            }
          });
          console.log('Datos de organizaciones externas cargados:', this.organizacionesMap);
        },
        error: (err) => console.error('Error al cargar datos de organizaciones externas:', err)
      });
    } else {
      console.log('No hay organizaciones externas para cargar');
    }
  }

  getOrganizacionNombre(idOrganizacion: number): string {
    const org = this.organizacionesMap.get(idOrganizacion);
    return org?.nombre || 'Cargando...';
  }

  getOrganizacionNit(idOrganizacion: number): string {
    const org = this.organizacionesMap.get(idOrganizacion);
    return org?.nit || '—';
  }

  getOrganizacionRepresentante(idOrganizacion: number): string {
    const org = this.organizacionesMap.get(idOrganizacion);
    return org?.representanteLegal || 'Cargando...';
  }

  searchEvents(query: string): void {
    if (!query || query.trim() === '') {
      this.loadEvents();
      return;
    }
    
    this.eventosApiService.getByTitulo(query).subscribe({
      next: (events) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Filtrar solo eventos aprobados y que no hayan pasado
        this.events = events.filter(event => {
          const isApproved = event.estado === 'Aprobado';
          
          const eventDate = new Date(event.fecha);
          eventDate.setHours(0, 0, 0, 0);
          const isNotPast = eventDate >= today;
          
          return isApproved && isNotPast;
        });
      },
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
