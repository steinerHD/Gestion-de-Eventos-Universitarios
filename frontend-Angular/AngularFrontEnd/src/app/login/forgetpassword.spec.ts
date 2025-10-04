import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ForgetPasswordComponent } from './forgetpassword';

describe('ForgetPasswordComponent', () => {
  let component: ForgetPasswordComponent;
  let fixture: ComponentFixture<ForgetPasswordComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForgetPasswordComponent],
      imports: [ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgetPasswordComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    component.formGroup = formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('el formulario debería ser inválido si está vacío', () => {
    expect(component.formGroup.valid).toBeFalse();
  });

  it('el formulario debería ser válido con email correcto', () => {
    component.formGroup.setValue({ email: 'test@test.com' });
    expect(component.formGroup.valid).toBeTrue();
  });

  it('debería emitir onSubmit al enviar formulario válido', () => {
    spyOn(component.onSubmit, 'emit');
    component.formGroup.setValue({ email: 'test@test.com' });
    component.submit();
    expect(component.onSubmit.emit).toHaveBeenCalled();
  });
});
