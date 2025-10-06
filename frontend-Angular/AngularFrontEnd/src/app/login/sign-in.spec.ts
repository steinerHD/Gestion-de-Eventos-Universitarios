import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SignInComponent } from './sign-in';
import { AuthService } from '../services/auth.service'; // Updated path

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    authServiceSpy.login.and.returnValue(of({ success: true }));

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SignInComponent],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('el formulario debería ser inválido si está vacío', () => {
    expect(component.loginForm.valid).toBeFalse();
  });

  it('debería llamar a authService.login y navegar a /home con formulario válido', () => {
    component.loginForm.setValue({ email: 'test@test.com', password: '123456' });
    component.onSubmit();
    expect(authService.login).toHaveBeenCalledWith('test@test.com', '123456');
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('debería mostrar alerta si authService.login falla', () => {
    authService.login.and.returnValue(throwError(() => new Error('Credenciales inválidas')));
    spyOn(window, 'alert');
    component.loginForm.setValue({ email: 'test@test.com', password: 'wrong' });
    component.onSubmit();
    expect(authService.login).toHaveBeenCalledWith('test@test.com', 'wrong');
    expect(window.alert).toHaveBeenCalledWith('Error al iniciar sesión. Verifica tus credenciales.');
  });
});