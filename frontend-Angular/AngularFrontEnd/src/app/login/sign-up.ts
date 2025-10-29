import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { concatMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { InputValidationService, forbidDangerousContent } from '../services/input-validation.service';
import { notyf } from '../app';



@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrls: ['./sign-up.css']
})

export class SignUpComponent {

  @Output() goSignin = new EventEmitter<void>();

  signUpForm: FormGroup;
  @Input() formGroup!: FormGroup;
  @Output() onSubmit = new EventEmitter<void>();
  @Output() goToSignIn = new EventEmitter<void>();

  submit() {
    this.onSubmit.emit();
  }

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private inputValidation: InputValidationService) {
    const allowedEmailPattern = /^[^\s@]+@uao\.edu\.co$/i;

    this.signUpForm = this.fb.group({
      name: ['', [Validators.required, forbidDangerousContent(this.inputValidation)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(allowedEmailPattern), forbidDangerousContent(this.inputValidation)]],
      userType: ['', Validators.required],
      academicUnit: ['', [forbidDangerousContent(this.inputValidation)]],
      codigoEstudiantil: ['', [forbidDangerousContent(this.inputValidation)]],
      cargo: ['', [forbidDangerousContent(this.inputValidation)]],
      program: ['', [forbidDangerousContent(this.inputValidation)]],
      faculty: ['', [forbidDangerousContent(this.inputValidation)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordsMatch });
    // Dynamic validators based on selected user type
    const userTypeControl = this.signUpForm.get('userType');
    userTypeControl?.valueChanges.subscribe((type: string) => {
      const academicUnit = this.signUpForm.get('academicUnit');
      const cargo = this.signUpForm.get('cargo');
      const program = this.signUpForm.get('program');
      const codigoEstudiantil = this.signUpForm.get('codigoEstudiantil');
      const faculty = this.signUpForm.get('faculty');

      // Clear all role validators first
      academicUnit?.clearValidators();
      cargo?.clearValidators();
      program?.clearValidators();
      codigoEstudiantil?.clearValidators();
      faculty?.clearValidators();

      if (type === 'Docente') {
        academicUnit?.setValidators([Validators.required]);
        cargo?.setValidators([Validators.required]);
      } else if (type === 'Estudiante') {
        program?.setValidators([Validators.required]);
        codigoEstudiantil?.setValidators([Validators.required]);
      } else if (type === 'Secretaria') {
        faculty?.setValidators([Validators.required]);
      }

      academicUnit?.updateValueAndValidity({ emitEvent: false });
      cargo?.updateValueAndValidity({ emitEvent: false });
      program?.updateValueAndValidity({ emitEvent: false });
      codigoEstudiantil?.updateValueAndValidity({ emitEvent: false });
      faculty?.updateValueAndValidity({ emitEvent: false });
    });
  }

  private passwordsMatch(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { passwordsMismatch: true };
  }

  onSignUp() {
    if (!this.signUpForm.valid) {
      this.signUpForm.markAllAsTouched();
      
      // Verificar si hay errores de contenido peligroso
      const dangerousFields = this.getDangerousFields();
      if (dangerousFields.length > 0) {
        notyf.error(`Hay campos que tienen símbolos o contenido malicioso: ${dangerousFields.join(', ')}`);
        return;
      }
      
      return;
    }

    const raw = this.signUpForm.value;
    const name = this.inputValidation.sanitize(raw.name);
    const email = this.inputValidation.sanitize(raw.email);
    const password = raw.password; // do not sanitize password beyond backend rules
    const userType = raw.userType;
    const academicUnit = this.inputValidation.sanitize(raw.academicUnit);
    const program = this.inputValidation.sanitize(raw.program);
    const faculty = this.inputValidation.sanitize(raw.faculty);
    const cargo = this.inputValidation.sanitize(raw.cargo);
    const codigoEstudiantil = this.inputValidation.sanitize(raw.codigoEstudiantil);

    // Registro sin endpoints protegidos: crear usuario y luego asignar rol
    this.authService.registrarUsuario(name, email, password).pipe(
      concatMap((usuarioCreado) => {
        const idUsuario = (usuarioCreado?.idUsuario ?? usuarioCreado?.id) || undefined;
        if (!idUsuario) throw new Error('No se recibió el ID del usuario');

        // Dependiendo del tipo de usuario
        if (userType === 'Estudiante' && program && codigoEstudiantil) {
          return this.authService.registrarEstudiante(idUsuario, codigoEstudiantil, program);
        } else if (userType === 'Docente' && academicUnit) {
          return this.authService.registrarDocente(idUsuario, academicUnit, cargo);
        } else if (userType === 'Secretaria' && faculty) {
          return this.authService.registrarSecretaria(idUsuario, faculty);
        }

        // Si no hay tipo válido, devolvemos un observable vacío
        return of(null);

      })
    ).subscribe({
      next: () => this.router.navigate(['/signin']),
      error: (err) => {
        console.error(err);
        const msg = err?.error || err?.message || 'Error al registrar usuario o perfil asociado';
        notyf.error(msg);
      }
    });
  }

  private getDangerousFields(): string[] {
    const dangerousFields: string[] = [];
    const fieldNames: { [key: string]: string } = {
      'name': 'Nombre',
      'email': 'Correo',
      'academicUnit': 'Unidad Académica',
      'codigoEstudiantil': 'Código Estudiantil',
      'cargo': 'Cargo',
      'program': 'Programa',
      'faculty': 'Facultad'
    };

    Object.keys(fieldNames).forEach(fieldName => {
      const control = this.signUpForm.get(fieldName);
      if (control && control.hasError('dangerousContent')) {
        dangerousFields.push(fieldNames[fieldName]);
      }
    });

    return dangerousFields;
  }
}