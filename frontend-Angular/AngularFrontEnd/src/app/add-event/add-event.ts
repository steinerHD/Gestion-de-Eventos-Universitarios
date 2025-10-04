import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { EventService } from '../services/event.service';
import { ExternalOrganization } from '../services/organization.service';
import { OrganizacionExternaComponent } from '../components/organizacion-externa/organizacion-externa';
import { SelectedOrganizationsComponent } from '../components/selected-organizations/selected-organizations';
import { EncountersComponent, Encounter } from '../components/encounters/encounters';

@Component({
  selector: 'app-add-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, OrganizacionExternaComponent, SelectedOrganizationsComponent, EncountersComponent],
  templateUrl: './add-event.html',
  styleUrls: ['./add-event.css']
})
export class AddEventComponent {
  eventForm: FormGroup;
  showOrgModal: boolean = false;
  selectedOrganizations: ExternalOrganization[] = [];
  encounters: Encounter[] = [];
  
  constructor(private fb: FormBuilder, private eventService: EventService, private router: Router) {
    this.eventForm = this.fb.group({
      eventName: ['', Validators.required],
      eventLocation: ['', Validators.required],
      eventType: ['', Validators.required],
      responsibleId: ['', Validators.required],
      eventStatus: ['Borrador', Validators.required],
      externalOrgName: [''],
      externalOrgNit: [''],
      externalOrgParticipation: [false]
    });
  }


  submitEvent(): void {
    if (this.eventForm.valid && this.encounters.length > 0) {
      const eventData = {
        ...this.eventForm.value,
        selectedOrganizations: this.selectedOrganizations,
        hasExternalOrganizations: this.selectedOrganizations.length > 0,
        encounters: this.encounters
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
    } else if (this.encounters.length === 0) {
      alert('El evento debe tener al menos un encuentro.');
    }
  }

  cancel(): void {
    this.eventForm.reset();
    this.router.navigate(['/home']);
  }

  openModal(): void {
    this.showOrgModal = true;
  }

  closeOrgModal(): void {
    this.showOrgModal = false;
  }

  onOrganizationSelected(organization: ExternalOrganization): void {
    // Verificar si ya está seleccionada
    const isAlreadySelected = this.selectedOrganizations.some(org => org.id === organization.id);
    
    if (!isAlreadySelected) {
      this.selectedOrganizations.push(organization);
      this.updateFormWithSelectedOrganizations();
    }
  }

  onOrganizationRemoved(organization: ExternalOrganization): void {
    this.selectedOrganizations = this.selectedOrganizations.filter(org => org.id !== organization.id);
    this.updateFormWithSelectedOrganizations();
  }

  private updateFormWithSelectedOrganizations(): void {
    // Actualizar el formulario con las organizaciones seleccionadas
    if (this.selectedOrganizations.length > 0) {
      const firstOrg = this.selectedOrganizations[0];
      this.eventForm.patchValue({
        externalOrgName: firstOrg.name,
        externalOrgNit: firstOrg.nit,
        externalOrgParticipation: true
      });
    } else {
      this.eventForm.patchValue({
        externalOrgName: '',
        externalOrgNit: '',
        externalOrgParticipation: false
      });
    }
  }

  onParticipationChange(): void {
    const participation = this.eventForm.get('externalOrgParticipation')?.value;
    if (!participation) {
      this.selectedOrganizations = [];
      this.eventForm.patchValue({
        externalOrgName: '',
        externalOrgNit: ''
      });
    }
  }

  onEncountersChanged(encounters: Encounter[]): void {
    this.encounters = encounters;
  }
}
