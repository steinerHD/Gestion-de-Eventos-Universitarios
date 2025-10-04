import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-add-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './add-event.html',
  styleUrls: ['./add-event.css']
})
export class AddEventComponent {
  eventForm: FormGroup;
  selectedFile: File | null = null;
  
  constructor(private fb: FormBuilder, private eventService: EventService, private router: Router) {
    this.eventForm = this.fb.group({
      eventName: ['', Validators.required],
      eventLocation: ['', Validators.required],
      eventType: ['', Validators.required],
      responsibleId: ['', Validators.required],
      eventDate: ['', Validators.required],
      eventHourIni: ['', Validators.required],
      eventHourFin: ['', Validators.required],
      eventStatus: ['Borrador', Validators.required],
      externalOrgName: [''],
      externalOrgNit: [''],
      externalOrgParticipation: [false]
    });
  }

  onFileSelected(event: Event<HTMLInputElement>): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  submitEvent(): void {
    if (this.eventForm.valid) {
      const eventData = {
        ...this.eventForm.value,
        file: this.selectedFile
      };
      this.eventService.addEvent(eventData).subscribe({
        next: () => {
          alert('Evento creado exitosamente.');
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Error al crear evento:', error);
          alert('Error al crear el evento. Intenta de nuevo.');
        }
      });
    }
  }

  cancel(): void {
    this.eventForm.reset();
    this.router.navigate(['/home']);
  }

  openModal(): void {
    // Placeholder for modal logic
    alert('Abrir listado de organizaciones externas (modal no implementado).');
  }
}
