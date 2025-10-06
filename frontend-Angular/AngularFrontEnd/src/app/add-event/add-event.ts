import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { EventService } from '../services/event.service';
import { OrganizacionExternaDTO } from '../services/organizaciones.api.service';
import { UsuarioDTO } from '../services/usuarios.api.service';
import { OrganizacionExternaComponent } from '../components/organizacion-externa/organizacion-externa';
import { SelectedOrganizationsComponent } from '../components/selected-organizations/selected-organizations';
import { UsuarioSelectionComponent } from '../components/usuario-selection/usuario-selection';
import { SelectedUsersComponent } from '../components/selected-users/selected-users';
import { EncountersComponent, Encounter } from '../components/encounters/encounters';

@Component({
  selector: 'app-add-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, OrganizacionExternaComponent, SelectedOrganizationsComponent, UsuarioSelectionComponent, SelectedUsersComponent, EncountersComponent],
  templateUrl: './add-event.html',
  styleUrls: ['./add-event.css']
})
export class AddEventComponent {
  eventForm: FormGroup;
  showOrgModal: boolean = false;
  showUserModal: boolean = false;
  selectedOrganizations: OrganizacionExternaDTO[] = [];
  selectedUsers: UsuarioDTO[] = [];
  encounters: Encounter[] = [];
  
  constructor(private fb: FormBuilder, private eventService: EventService, private router: Router) {
    this.eventForm = this.fb.group({
      eventName: ['', Validators.required],
      eventLocation: ['', Validators.required],
      eventType: ['', Validators.required],
      eventStatus: ['Borrador', Validators.required],
      externalOrgName: [''],
      externalOrgNit: [''],
      externalOrgParticipation: [false]
    });
  }


  submitEvent(): void {
    if (this.eventForm.valid && this.encounters.length > 0 && this.selectedUsers.length > 0) {
      const eventData = {
        ...this.eventForm.value,
        selectedOrganizations: this.selectedOrganizations,
        selectedUsers: this.selectedUsers,
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
    } else if (this.selectedUsers.length === 0) {
      alert('El evento debe tener al menos un organizador.');
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

  openUserModal(): void {
    this.showUserModal = true;
  }

  closeUserModal(): void {
    this.showUserModal = false;
  }

  onOrganizationSelected(organization: OrganizacionExternaDTO): void {
    // Verificar si ya está seleccionada
    const isAlreadySelected = this.selectedOrganizations.some(org => org.idOrganizacion === organization.idOrganizacion);
    
    if (!isAlreadySelected) {
      this.selectedOrganizations.push(organization);
      this.updateFormWithSelectedOrganizations();
    }
  }

  onOrganizationRemoved(organization: OrganizacionExternaDTO): void {
    this.selectedOrganizations = this.selectedOrganizations.filter(org => org.idOrganizacion !== organization.idOrganizacion);
    this.updateFormWithSelectedOrganizations();
  }

  private updateFormWithSelectedOrganizations(): void {
    // Actualizar el formulario con las organizaciones seleccionadas
    if (this.selectedOrganizations.length > 0) {
      const firstOrg = this.selectedOrganizations[0];
      this.eventForm.patchValue({
        externalOrgName: firstOrg.nombre,
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

  onUserSelected(user: UsuarioDTO): void {
    // Verificar si ya está seleccionado
    const isAlreadySelected = this.selectedUsers.some(u => u.idUsuario === user.idUsuario);
    
    if (!isAlreadySelected) {
      this.selectedUsers.push(user);
    }
  }

  onUserRemoved(user: UsuarioDTO): void {
    this.selectedUsers = this.selectedUsers.filter(u => u.idUsuario !== user.idUsuario);
  }

  onEncountersChanged(encounters: Encounter[]): void {
    this.encounters = encounters;
  }
}
