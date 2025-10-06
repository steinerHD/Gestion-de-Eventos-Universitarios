import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SignUpComponent } from './sign-up';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignUpComponent],
      imports: [ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    component.formGroup = formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userType: ['', Validators.required],
      academicUnit: [''],
      program: [''],
      faculty: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });

    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('el formulario debería ser inválido inicialmente', () => {
    expect(component.formGroup.valid).toBeFalse();
  });

  it('debería ser válido si los campos obligatorios están completos', () => {
    component.formGroup.setValue({
      name: 'Usuario Prueba',
      email: 'test@test.com',
      userType: 'docente',
      academicUnit: 'Ciencias',
      program: '',
      faculty: '',
      password: 'Password1',
      confirmPassword: 'Password1'
    });
    expect(component.formGroup.valid).toBeTrue();
  });

  it('debería emitir onSubmit al enviar formulario válido', () => {
    spyOn(component.onSubmit, 'emit');
    component.formGroup.patchValue({
      name: 'Usuario Prueba',
      email: 'test@test.com',
      userType: 'estudiante',
      program: 'Ingeniería',
      password: 'Password1',
      confirmPassword: 'Password1'
    });
    component.submit();
    expect(component.onSubmit.emit).toHaveBeenCalled();
  });

  it('debería emitir goToSignIn al llamar a goToSignIn.emit()', () => {
    spyOn(component.goToSignIn, 'emit');
    component.goToSignIn.emit();
    expect(component.goToSignIn.emit).toHaveBeenCalled();
  });
});
