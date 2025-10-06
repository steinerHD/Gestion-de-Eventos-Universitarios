import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrganizacionesApiService, OrganizacionExternaDTO } from '../../services/organizaciones.api.service';

@Component({
  selector: 'app-nueva-orga-ext',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './nueva-orga-ext.html',
  styleUrls: ['./nueva-orga-ext.css']
})
export class NuevaOrgaExtComponent implements OnInit {
  organizationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private organizacionesApi: OrganizacionesApiService,
    private router: Router
  ) {
    this.organizationForm = this.fb.group({
      nombre: ['', Validators.required],
      nit: ['', Validators.required],
      direccion: ['', Validators.required],
      representanteLegal: ['', Validators.required],
      telefono: ['', Validators.required],
      sectorEconomico: ['', Validators.required],
      actividadPrincipal: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.organizationForm.valid) {
      const organizationData = this.organizationForm.value;
      const payload: OrganizacionExternaDTO = {
        nombre: organizationData.nombre,
        nit: organizationData.nit,
        ubicacion: organizationData.direccion, // mapear campo del formulario
        representanteLegal: organizationData.representanteLegal,
        telefono: organizationData.telefono,
        sectorEconomico: organizationData.sectorEconomico,
        actividadPrincipal: organizationData.actividadPrincipal
      };

      this.organizacionesApi.create(payload).subscribe({
        next: (organization) => {
          console.log('Organización registrada exitosamente:', organization);
          alert('Organización registrada exitosamente');
          this.router.navigate(['/add-event']);
        },
        error: (error) => {
          console.error('Error al registrar organización:', error);
          alert('Error al registrar la organización');
        }
      });
    } else {
      this.organizationForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.router.navigate(['/add-event']);
  }
}