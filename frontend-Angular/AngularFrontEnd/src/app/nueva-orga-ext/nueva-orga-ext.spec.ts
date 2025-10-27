import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NuevaOrgaExtComponent } from './nueva-orga-ext';
import { OrganizacionesApiService, OrganizacionExternaDTO } from '../services/organizaciones.api.service';

describe('NuevaOrgaExtComponent', () => {
  let component: NuevaOrgaExtComponent;
  let fixture: ComponentFixture<NuevaOrgaExtComponent>;
  let mockOrganizacionesApiService: jasmine.SpyObj<OrganizacionesApiService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockOrganizationData: OrganizacionExternaDTO = {
    idOrganizacion: 1,
    nombre: 'Organización Test',
    nit: '12345678-9',
    ubicacion: 'Calle 123 #45-67',
    representanteLegal: 'Juan Pérez',
    telefono: '3001234567',
    sectorEconomico: 'Tecnología',
    actividadPrincipal: 'Desarrollo de software'
  };

  beforeEach(async () => {
    const organizacionesApiSpy = jasmine.createSpyObj('OrganizacionesApiService', ['create']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NuevaOrgaExtComponent],
      providers: [
        { provide: OrganizacionesApiService, useValue: organizacionesApiSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NuevaOrgaExtComponent);
    component = fixture.componentInstance;
    mockOrganizacionesApiService = TestBed.inject(OrganizacionesApiService) as jasmine.SpyObj<OrganizacionesApiService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.organizationForm.get('nombre')?.value).toBe('');
    expect(component.organizationForm.get('nit')?.value).toBe('');
    expect(component.organizationForm.get('direccion')?.value).toBe('');
    expect(component.organizationForm.get('representanteLegal')?.value).toBe('');
    expect(component.organizationForm.get('telefono')?.value).toBe('');
    expect(component.organizationForm.get('sectorEconomico')?.value).toBe('');
    expect(component.organizationForm.get('actividadPrincipal')?.value).toBe('');
  });

  it('should have required validators on all form fields', () => {
    const form = component.organizationForm;
    
    // Test that all fields are required
    expect(form.get('nombre')?.hasError('required')).toBeTruthy();
    expect(form.get('nit')?.hasError('required')).toBeTruthy();
    expect(form.get('direccion')?.hasError('required')).toBeTruthy();
    expect(form.get('representanteLegal')?.hasError('required')).toBeTruthy();
    expect(form.get('telefono')?.hasError('required')).toBeTruthy();
    expect(form.get('sectorEconomico')?.hasError('required')).toBeTruthy();
    expect(form.get('actividadPrincipal')?.hasError('required')).toBeTruthy();
  });

  it('should be valid when all fields are filled', () => {
    component.organizationForm.patchValue({
      nombre: 'Organización Test',
      nit: '12345678-9',
      direccion: 'Calle 123 #45-67',
      representanteLegal: 'Juan Pérez',
      telefono: '3001234567',
      sectorEconomico: 'Tecnología',
      actividadPrincipal: 'Desarrollo de software'
    });

    expect(component.organizationForm.valid).toBeTruthy();
  });

  it('should call organizacionesApi.create when form is valid and onSubmit is called', () => {
    // Arrange
    component.organizationForm.patchValue({
      nombre: 'Organización Test',
      nit: '12345678-9',
      direccion: 'Calle 123 #45-67',
      representanteLegal: 'Juan Pérez',
      telefono: '3001234567',
      sectorEconomico: 'Tecnología',
      actividadPrincipal: 'Desarrollo de software'
    });

    mockOrganizacionesApiService.create.and.returnValue(of(mockOrganizationData));

    // Act
    component.onSubmit();

    // Assert
    expect(mockOrganizacionesApiService.create).toHaveBeenCalledWith({
      nombre: 'Organización Test',
      nit: '12345678-9',
      ubicacion: 'Calle 123 #45-67',
      representanteLegal: 'Juan Pérez',
      telefono: '3001234567',
      sectorEconomico: 'Tecnología',
      actividadPrincipal: 'Desarrollo de software'
    });
  });

  it('should navigate to add-event after successful organization creation', () => {
    // Arrange
    component.organizationForm.patchValue({
      nombre: 'Organización Test',
      nit: '12345678-9',
      direccion: 'Calle 123 #45-67',
      representanteLegal: 'Juan Pérez',
      telefono: '3001234567',
      sectorEconomico: 'Tecnología',
      actividadPrincipal: 'Desarrollo de software'
    });

    mockOrganizacionesApiService.create.and.returnValue(of(mockOrganizationData));

    // Act
    component.onSubmit();

    // Assert
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/add-event']);
  });

  it('should handle API error when creating organization', () => {
    // Arrange
    component.organizationForm.patchValue({
      nombre: 'Organización Test',
      nit: '12345678-9',
      direccion: 'Calle 123 #45-67',
      representanteLegal: 'Juan Pérez',
      telefono: '3001234567',
      sectorEconomico: 'Tecnología',
      actividadPrincipal: 'Desarrollo de software'
    });

    const error = new Error('API Error');
    mockOrganizacionesApiService.create.and.returnValue(throwError(() => error));

    // Spy on console.error and alert
    spyOn(console, 'error');
    spyOn(window, 'alert');

    // Act
    component.onSubmit();

    // Assert
    expect(console.error).toHaveBeenCalledWith('Error al registrar organización:', error);
    expect(window.alert).toHaveBeenCalledWith('Error al registrar la organización');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should mark all fields as touched when form is invalid and onSubmit is called', () => {
    // Arrange - form is already invalid with empty values
    spyOn(component.organizationForm, 'markAllAsTouched');

    // Act
    component.onSubmit();

    // Assert
    expect(component.organizationForm.markAllAsTouched).toHaveBeenCalled();
    expect(mockOrganizacionesApiService.create).not.toHaveBeenCalled();
  });

  it('should navigate to add-event when cancel is called', () => {
    // Act
    component.cancel();

    // Assert
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/add-event']);
  });

  it('should map direccion field to ubicacion in payload', () => {
    // Arrange
    component.organizationForm.patchValue({
      nombre: 'Test Org',
      nit: '12345678-9',
      direccion: 'Test Address',
      representanteLegal: 'Test Rep',
      telefono: '3001234567',
      sectorEconomico: 'Test Sector',
      actividadPrincipal: 'Test Activity'
    });

    mockOrganizacionesApiService.create.and.returnValue(of(mockOrganizationData));

    // Act
    component.onSubmit();

    // Assert
    const expectedPayload = {
      nombre: 'Test Org',
      nit: '12345678-9',
      ubicacion: 'Test Address', // Should map from direccion
      representanteLegal: 'Test Rep',
      telefono: '3001234567',
      sectorEconomico: 'Test Sector',
      actividadPrincipal: 'Test Activity'
    };

    expect(mockOrganizacionesApiService.create).toHaveBeenCalledWith(expectedPayload);
  });

  it('should display success alert after successful organization creation', () => {
    // Arrange
    component.organizationForm.patchValue({
      nombre: 'Organización Test',
      nit: '12345678-9',
      direccion: 'Calle 123 #45-67',
      representanteLegal: 'Juan Pérez',
      telefono: '3001234567',
      sectorEconomico: 'Tecnología',
      actividadPrincipal: 'Desarrollo de software'
    });

    mockOrganizacionesApiService.create.and.returnValue(of(mockOrganizationData));
    spyOn(window, 'alert');

    // Act
    component.onSubmit();

    // Assert
    expect(window.alert).toHaveBeenCalledWith('Organización registrada exitosamente');
  });
});
