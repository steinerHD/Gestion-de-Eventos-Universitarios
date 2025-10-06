import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class EventService {
  private events = [
    {
      eventName: 'Evento de Prueba',
      eventLocation: 'Universidad',
      eventType: 'academico',
      responsibleId: '12345',
      eventDate: '2025-10-04',
      eventHourIni: '09:00',
      eventHourFin: '11:00',
      eventStatus: 'Borrador',
      externalOrgName: '',
      externalOrgNit: '',
      externalOrgParticipation: false,
      encounters: [
        {
          id: '1',
          date: '2025-10-04',
          startTime: '09:00',
          endTime: '11:00',
          location: {
            id: '111',
            name: 'Salón 111',
            type: 'salón',
            capacity: 25
          }
        }
      ]
    }
  ];

  getEvents(): Observable<any[]> {
    return of(this.events);
  }

  addEvent(event: any): Observable<void> {
    this.events.push(event);
    return of();
  }

  searchEvents(query: string): Observable<any[]> {
    if (!query || query.trim() === '') {
      return of(this.events);
    }
    const filteredEvents = this.events.filter(event => 
      event.eventName.toLowerCase().includes(query.toLowerCase()) ||
      event.eventLocation.toLowerCase().includes(query.toLowerCase()) ||
      event.eventType.toLowerCase().includes(query.toLowerCase())
    );
    return of(filteredEvents);
  }
}
