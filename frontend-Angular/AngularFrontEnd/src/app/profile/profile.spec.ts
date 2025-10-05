import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ProfileComponent } from './profile';
import { AuthService } from '../services/auth.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    // Mock AuthService
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserProfile', 'updateUserProfile']);
    authServiceSpy.getUserProfile.and.returnValue(of({
      nombre: 'Pepito Alberto Diaz Castillo',
      tipoUsuario: 'Estudiante',
      rolCuenta: 'Estudiante',
      email: 'Pepito@U.edu.co',
      facultad: 'Ingeniería',
      codigoEstudiantil: 'I0000000'
    }));
    authServiceSpy.updateUserProfile.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ProfileComponent], // Standalone component
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería tener un formulario inválido si está vacío', () => {
    expect(component.profileForm.valid).toBeFalse();
  });

  it('debería cargar datos del usuario en ngOnInit', () => {
    expect(authService.getUserProfile).toHaveBeenCalled();
    expect(component.profileForm.get('nombre')?.value).toBe('Pepito Alberto Diaz Castillo');
    expect(component.profileForm.get('tipoUsuario')?.value).toBe('Estudiante');
    expect(component.profileForm.get('rolCuenta')?.value).toBe('Estudiante');
    expect(component.profileForm.get('email')?.value).toBe('Pepito@U.edu.co');
    expect(component.profileForm.get('facultad')?.value).toBe('Ingeniería');
    expect(component.profileForm.get('codigoEstudiantil')?.value).toBe('I0000000');
  });

  it('debería ser válido cuando se llenan todos los campos', () => {
    component.profileForm.setValue({
      nombre: 'Pepito Alberto Diaz Castillo',
      tipoUsuario: 'Estudiante',
      rolCuenta: 'Estudiante',
      email: 'Pepito@U.edu.co',
      facultad: 'Ingeniería',
      codigoEstudiantil: 'I0000000'
    });
    expect(component.profileForm.valid).toBeTrue();
  });

  it('debería guardar cambios si el formulario es válido', () => {
    component.profileForm.setValue({
      nombre: 'Pepito Alberto Diaz Castillo',
      tipoUsuario: 'Estudiante',
      rolCuenta: 'Estudiante',
      email: 'Pepito@U.edu.co',
      facultad: 'Ingeniería',
      codigoEstudiantil: 'I0000000'
    });
    component.isEditing = true; // Enable edit mode
    component.toggleEdit();
    expect(authService.updateUserProfile).toHaveBeenCalledWith(component.profileForm.value);
  });

  it('debería resetear el formulario al cancelar edición', () => {
    component.profileForm.setValue({
      nombre: 'Nombre Modificado',
      tipoUsuario: 'Profesor',
      rolCuenta: 'Profesor',
      email: 'modificado@U.edu.co',
      facultad: 'Ciencias',
      codigoEstudiantil: 'I9999999'
    });
    component.cancelEdit();
    expect(component.isEditing).toBeFalse();
    expect(authService.getUserProfile).toHaveBeenCalledTimes(2); // Called in ngOnInit and cancelEdit
    expect(component.profileForm.get('nombre')?.value).toBe('Pepito Alberto Diaz Castillo');
  });

  it('debería manejar errores al cargar datos del usuario', () => {
    authService.getUserProfile.and.returnValue(throwError(() => new Error('No user logged in')));
    spyOn(window, 'alert');
    component.loadUserData();
    expect(window.alert).toHaveBeenCalledWith('Error al cargar el perfil. Intenta de nuevo.');
  });
});