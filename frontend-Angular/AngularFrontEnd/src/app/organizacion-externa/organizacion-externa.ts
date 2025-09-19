import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-organizacion-externa',
  imports: [],
  templateUrl: './organizacion-externa.html',
  styleUrl: './organizacion-externa.css'
})

export class OrganizacionExternaComponent {
  // Datos de ejemplo para la lista de organizaciones
  organizaciones = signal([
    { id: 1, nombre: 'Universidad Operativa de Colombia', nit: '12231341424151' },
    { id: 2, nombre: 'Mercá', nit: '12231341734151' },
    { id: 3, nombre: 'BVVA', nit: '1333331734151' },
    { id: 4, nombre: 'Disneyland', nit: '13338461254151' },
    { id: 5, nombre: 'Plan padrinos', nit: '1333327455151' },
    { id: 6, nombre: 'Ministerio de la seriedad', nit: '13323987455151' }
  ]);
}
