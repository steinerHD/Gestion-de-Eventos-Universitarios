import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SignInComponent } from './sign-in';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [SignInComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería ser inválido si está vacío', () => {
    expect(component.signInForm.valid).toBeFalse();
  });

  it('debería ser válido con email y password correctos', () => {
    component.signInForm.setValue({
      email: 'test@uni.edu',
      password: 'Abc123',
    });
    expect(component.signInForm.valid).toBeTrue();
  });

  it('debería fallar si el email no es válido', () => {
    component.signInForm.patchValue({
      email: 'correo_invalido',
      password: '123456',
    });
    expect(component.signInForm.valid).toBeFalse();
  });
});
