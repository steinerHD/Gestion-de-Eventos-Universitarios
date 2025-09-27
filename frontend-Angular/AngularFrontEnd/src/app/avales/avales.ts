import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avales',
  standalone: true, // Asegúrate de marcarlo como standalone si usas imports
  imports: [CommonModule],
  templateUrl: './avales.html',
  styleUrls: ['./avales.css'] // Usa styleUrls (arreglo), no styleUrl
})
export class Avales {
  avales: { name: string }[] = [];

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        this.avales.push({ name: input.files[i].name });
      }
      input.value = ''; // Limpia el input para permitir subir el mismo archivo de nuevo si se desea
    }
  }

  eliminarAval(index: number) {
    this.avales.splice(index, 1);
  }
}

