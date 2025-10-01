
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { first } from 'rxjs';
@Component({
  selector: 'app-add-event',
  imports: [],
  templateUrl: './add-event.html',
  styleUrl: './add-event.css'
})
export class AddEvent {
  protected readonly title = signal('AngularFrontEnd');
    // Señal para gestionar el estado de la ventana emergente.
  isModalOpen = signal(false);


  openModal(): void {
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
}
}

  standalone: true
