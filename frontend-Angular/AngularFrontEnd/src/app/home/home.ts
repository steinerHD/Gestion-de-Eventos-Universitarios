import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventosApiService, EventoDTO } from '../services/eventos.api.service';
import { AuthService } from '../services/auth.service';


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

  constructor(
    private eventosApiService: EventosApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    this.authService.getUserProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
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
      error: (error: Error) => console.error('Error al cargar eventos:', error)
    });
  }

  searchEvents(query: string): void {
    if (!query || query.trim() === '') {
      this.loadEvents();
      return;
    }
    
    this.eventosApiService.getByTitulo(query).subscribe({
      next: (events) => this.events = events,
      error: (error: Error) => console.error('Error al buscar eventos:', error)
    });
  }
  
}
