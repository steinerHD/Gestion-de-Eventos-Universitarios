import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avales.html',
  styleUrls: ['./avales.css']
})
export class AvalesComponent {
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