import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { concatMap } from 'rxjs/operators';
import { of } from 'rxjs';


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

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    const allowedEmailPattern = /^[^\s@]+@uao\.edu\.co$/i;

    this.signUpForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern(allowedEmailPattern)]],
      userType: ['', Validators.required],
      academicUnit: [''],
      codigoEstudiantil: [''],
      cargo: [''],
      program: [''],
      faculty: [''],
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
      return;
    }

    const { name, email, password, userType, academicUnit, program, faculty, cargo, codigoEstudiantil } = this.signUpForm.value;

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
        alert(msg);
      }
    });
  }
}