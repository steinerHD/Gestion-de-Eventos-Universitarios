import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ForgetPasswordComponent } from './forgetpassword';
import { AuthService } from '../services/auth.service';

describe('ForgetPasswordComponent', () => {
  let component: ForgetPasswordComponent;
  let fixture: ComponentFixture<ForgetPasswordComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['resetPassword']);
    authServiceSpy.resetPassword.and.returnValue(of({ success: true }));

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ForgetPasswordComponent],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgetPasswordComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('el formulario debería ser inválido si está vacío', () => {
    expect(component.forgetPasswordForm.valid).toBeFalse();
  });

  it('el formulario debería ser válido con un email correcto', () => {
    component.forgetPasswordForm.setValue({ email: 'test@test.com' });
    expect(component.forgetPasswordForm.valid).toBeTrue();
  });

  it('debería llamar a authService.resetPassword al enviar un formulario válido', () => {
    component.forgetPasswordForm.setValue({ email: 'test@test.com' });
    component.sendPwd();
    expect(authService.resetPassword).toHaveBeenCalledWith('test@test.com');
  });

  it('debería mostrar alerta de error si authService.resetPassword falla', () => {
    authService.resetPassword.and.returnValue(throwError(() => new Error('Error')));
    spyOn(window, 'alert');
    component.forgetPasswordForm.setValue({ email: 'test@test.com' });
    component.sendPwd();
    expect(authService.resetPassword).toHaveBeenCalledWith('test@test.com');
    expect(window.alert).toHaveBeenCalledWith('Error al enviar el correo. Intenta de nuevo.');
  });
});
