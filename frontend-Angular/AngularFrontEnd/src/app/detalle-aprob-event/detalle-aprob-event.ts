import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { EventosApiService, EventoDTO, ParticipacionDetalleDTO } from '../services/eventos.api.service';
import { OrganizacionesApiService, OrganizacionExternaDTO } from '../services/organizaciones.api.service';
import { InstalacionesApiService, InstalacionDTO } from '../services/instalaciones.api.service';
import { UsuariosApiService, UsuarioDTO } from '../services/usuarios.api.service';

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

@Component({
  selector: 'app-detalle-aprob-event',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detalle-aprob-event.html',
  styleUrls: ['./detalle-aprob-event.css']
})
export class DetalleAprobEvent implements OnInit {
  evento: EventoDTO | null = null;
  instalacionesList: InstalacionDTO[] = [];
  coorganizadoresList: string[] = [];
  organizerInfo: OrganizerExtended | null = null;
  participacionesDetailed: Array<{ original: ParticipacionDetalleDTO; org?: OrganizacionExternaDTO | null }> = [];
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private eventosApi: EventosApiService,
    private instalacionesApi: InstalacionesApiService,
    private usuariosApi: UsuariosApiService,
    private router: Router,
    private organizacionesApi: OrganizacionesApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
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
        // Cargar instalaciones completas
        this.instalacionesList = [];
        (e.instalaciones || []).forEach((idInst) => {
          this.instalacionesApi.getById(idInst).subscribe({
            next: (inst) => {
              this.instalacionesList.push(inst);
              this.cdr.detectChanges();
            },
            error: (err) => {
              console.warn('No se pudo cargar instalación id=', idInst, err);
            }
          });
        });

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
      window.open(url, '_blank');
    } catch (err) {
      console.error('No se pudo abrir el PDF:', err);
    }
  }
}
