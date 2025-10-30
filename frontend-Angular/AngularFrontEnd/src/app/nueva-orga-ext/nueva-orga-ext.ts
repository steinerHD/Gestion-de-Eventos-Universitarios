import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrganizacionesApiService, OrganizacionExternaDTO } from '../services/organizaciones.api.service';
import { AuthService } from '../services/auth.service';
import { InputValidationService, forbidDangerousContent } from '../services/input-validation.service';
import { notyf } from '../app';

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
    private authService: AuthService,
    private inputValidation: InputValidationService
  ) {
    this.organizationForm = this.fb.group({
      nombre: ['', [Validators.required, forbidDangerousContent(this.inputValidation)]],
      nit: ['', [Validators.required, forbidDangerousContent(this.inputValidation)]],
      direccion: ['', [Validators.required, forbidDangerousContent(this.inputValidation)]],
      representanteLegal: ['', [Validators.required, forbidDangerousContent(this.inputValidation)]],
      telefono: ['', [Validators.required, forbidDangerousContent(this.inputValidation)]],
      sectorEconomico: ['', [Validators.required, forbidDangerousContent(this.inputValidation)]],
      actividadPrincipal: ['', [Validators.required, forbidDangerousContent(this.inputValidation)]]
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
    if (!this.organizationForm.valid) {
      this.organizationForm.markAllAsTouched();
      
      // Verificar si hay errores de contenido peligroso
      const dangerousFields = this.getDangerousFields();
      if (dangerousFields.length > 0) {
        notyf.error(`Hay campos que tienen símbolos o contenido malicioso: ${dangerousFields.join(', ')}`);
        return;
      }
      
      return;
    }

    const organizationData = this.organizationForm.value;
    const payload: OrganizacionExternaDTO = {
      nombre: this.inputValidation.sanitize(organizationData.nombre),
      nit: this.inputValidation.sanitize(organizationData.nit),
      ubicacion: this.inputValidation.sanitize(organizationData.direccion), // mapear campo del formulario
      representanteLegal: this.inputValidation.sanitize(organizationData.representanteLegal),
      telefono: this.inputValidation.sanitize(organizationData.telefono),
      sectorEconomico: this.inputValidation.sanitize(organizationData.sectorEconomico),
      actividadPrincipal: this.inputValidation.sanitize(organizationData.actividadPrincipal),
      idCreador: this.currentUser.idUsuario // Asignar el ID del usuario actual como creador
    };

    this.organizacionesApi.create(payload).subscribe({
      next: (organization: OrganizacionExternaDTO) => {
        notyf.success('Organización registrada exitosamente');
        this.organizationCreated.emit(organization);
        this.organizationForm.reset();
      },
      error: (error: any) => {
        notyf.error('Error al registrar la organización');
      }
    });
  }

  private getDangerousFields(): string[] {
    const dangerousFields: string[] = [];
    const fieldNames: { [key: string]: string } = {
      'nombre': 'Nombre de la Organización',
      'nit': 'NIT',
      'direccion': 'Dirección',
      'representanteLegal': 'Representante Legal',
      'telefono': 'Teléfono',
      'sectorEconomico': 'Sector Económico',
      'actividadPrincipal': 'Actividad Principal'
    };

    Object.keys(fieldNames).forEach(fieldName => {
      const control = this.organizationForm.get(fieldName);
      if (control && control.hasError('dangerousContent')) {
        dangerousFields.push(fieldNames[fieldName]);
      }
    });

    return dangerousFields;
  }

  cancel(): void {
    this.organizationForm.reset();
    this.modalClosed.emit();
  }
}