import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrganizacionesApiService, OrganizacionExternaDTO } from '../services/organizaciones.api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nueva-orga-ext',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './nueva-orga-ext.html'
})
export class NuevaOrgaExtComponent implements OnInit {
  @Input() showModal: boolean = false;
  @Output() modalClosed = new EventEmitter<void>();
  @Output() organizationCreated = new EventEmitter<OrganizacionExternaDTO>();

  organizationForm: FormGroup;
  currentUser: any=null ; // Aquí deberías obtener el ID del usuario actual desde el servicio de autenticación

  

  constructor(
    private fb: FormBuilder,
    private organizacionesApi: OrganizacionesApiService,
    private authService: AuthService
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
    this.authService.getUserProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        console.log('👤 Usuario logueado actual:', this.currentUser);
      },
      error: (error) => {
        console.error('❌ Error al obtener usuario logueado:', error);
      }
    })
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
        actividadPrincipal: organizationData.actividadPrincipal,
        idCreador: this.currentUser.idUsuario // Asignar el ID del usuario actual como creador
      };

      this.organizacionesApi.create(payload).subscribe({
        next: (organization: OrganizacionExternaDTO) => {
          alert('Organización registrada exitosamente');
          this.organizationCreated.emit(organization);
          this.organizationForm.reset();
        },
        error: (error: any) => {
          alert('Error al registrar la organización');
        }
      });
    } else {
      this.organizationForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.organizationForm.reset();
    this.modalClosed.emit();
  }
}