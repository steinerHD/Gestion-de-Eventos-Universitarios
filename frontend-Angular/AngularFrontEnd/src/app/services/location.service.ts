import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Location {
  id: string;
  name: string;
  type: string;
  capacity: number;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private locations: Location[] = [];

  constructor() {
    this.generateLocations();
  }

  private generateLocations(): void {
    // Generar salones ABC (A=edificio 1-4, B=piso 1-5, C=salón 1-9)
    for (let edificio = 1; edificio <= 4; edificio++) {
      for (let piso = 1; piso <= 5; piso++) {
        for (let salon = 1; salon <= 9; salon++) {
          this.locations.push({
            id: `${edificio}${piso}${salon}`,
            name: `Salón ${edificio}${piso}${salon}`,
            type: 'salón',
            capacity: 25
          });
        }
      }
    }

    // Agregar auditorios
    this.locations.push(
      {
        id: 'auditorio-xepia',
        name: 'Auditorio Xepia',
        type: 'auditorio',
        capacity: 100
      },
      {
        id: 'auditorio-quincha',
        name: 'Auditorio Quincha',
        type: 'auditorio',
        capacity: 100
      }
    );
  }

  getLocations(): Observable<Location[]> {
    return of(this.locations);
  }

  searchLocations(query: string): Observable<Location[]> {
    if (!query || query.trim() === '') {
      return of(this.locations);
    }
    const filteredLocations = this.locations.filter(location => 
      location.name.toLowerCase().includes(query.toLowerCase()) ||
      location.type.toLowerCase().includes(query.toLowerCase()) ||
      location.capacity.toString().includes(query)
    );
    return of(filteredLocations);
  }

  getLocationById(id: string): Observable<Location | undefined> {
    const location = this.locations.find(loc => loc.id === id);
    return of(location);
  }
}
