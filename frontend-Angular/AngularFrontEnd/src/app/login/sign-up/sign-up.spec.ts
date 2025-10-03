import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from './sign-up';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [SignUpComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería ser inválido si está vacío', () => {
    expect(component.signUpForm.valid).toBeFalse();
  });

  it('debería ser válido con datos correctos', () => {
    component.signUpForm.setValue({
      name: 'Juan Perez',
      email: 'juan@uni.edu',
      userType: 'docente',
      academicUnit: 'Ciencias',
      program: '',
      faculty: '',
      password: 'Abc123',
      confirmPassword: 'Abc123',
    });
    expect(component.signUpForm.valid).toBeTrue();
    expect(component.signUpForm.errors).toBeNull();
  });

  it('debería marcar error si las contraseñas no coinciden', () => {
    component.signUpForm.patchValue({
      password: 'Abc123',
      confirmPassword: 'Xyz456',
    });
    expect(component.signUpForm.errors?.['passwordsMismatch']).toBeTruthy();
  });
});
