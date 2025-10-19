import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EventService } from '../services/event.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  events: any[] = [];

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
        console.log('Eventos cargados:', events);
      },
      error: (error: Error) => console.error('Error al cargar eventos:', error)
    });
  }

  searchEvents(query: string): void {
    this.eventService.searchEvents(query).subscribe((events: any[]) => this.events = events);
  }
  
}
