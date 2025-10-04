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
      externalOrgParticipation: false
    }
  ];

  getEvents(): Observable<any[]> {
    return of(this.events);
  }

  addEvent(event: any): Observable<void> {
    this.events.push(event);
    return of();
  }
}
