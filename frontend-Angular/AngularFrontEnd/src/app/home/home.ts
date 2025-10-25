import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventosApiService, EventoDTO } from '../services/eventos.api.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  events: EventoDTO[] = [];

  constructor(private eventosApiService: EventosApiService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

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
