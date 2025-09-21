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
  selectedFileName: string | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFileName = input.files[0].name;
    } else {
      this.selectedFileName = null;
    }
  }
}

