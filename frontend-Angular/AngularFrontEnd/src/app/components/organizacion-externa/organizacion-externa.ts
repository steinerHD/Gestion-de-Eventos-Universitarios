import { Component, signal } from '@angular/core';

interface Organizacion {
  id: number;
  nombre: string;
  nit: string;
}

@Component({
  selector: 'app-organizacion-externa',
  standalone: true,
  imports: [],
  templateUrl: './organizacion-externa.html',
  styleUrls: ['./organizacion-externa.css']
})

export class OrganizacionExternaComponent {
  // Datos de ejemplo para la lista de organizaciones
  private nextId = 3;
  organizaciones = signal<Organizacion[]>([
    { id: 5, nombre: 'Plan padrinos', nit: '1333327455151' },
    { id: 6, nombre: 'Ministerio de la seriedad', nit: '13323987455151' }
  ]);

  // Para búsqueda
  search = signal<string>('');

  get organizacionesFiltradas() {
    const term = this.search().toLowerCase();
    return this.organizaciones().filter(org =>
      org.nombre.toLowerCase().includes(term) || org.nit.includes(term)
    );
  }

  // Método para añadir nuevas orgs
  addOrganizacion(nombre: string, nit: string) {
    const newOrg: Organizacion = {
      id: this.nextId++,
      nombre,
      nit
    };
    this.organizaciones.update(list => [...list, newOrg]);
  }

  // Método para capturar el input de búsqueda
  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.search.set(value);
  }
}
