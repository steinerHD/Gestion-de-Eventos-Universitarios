import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

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

  constructor(private fb: FormBuilder, private router: Router) {
    this.signUpForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userType: ['', Validators.required],
      academicUnit: [''],
      program: [''],
      faculty: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordsMatch });
  }

  private passwordsMatch(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { passwordsMismatch: true };
  }

  onSignUp() {
    if (this.signUpForm.valid) {
      const userData = this.signUpForm.value;
      console.log('Usuario registrado exitosamente:', userData);
      
      // Guardar datos del usuario en localStorage para simular base de datos
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString()
      };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Redirigir a signin después del registro exitoso
      this.router.navigate(['/signin']);
    } else {
      this.signUpForm.markAllAsTouched();
    }
  }
}