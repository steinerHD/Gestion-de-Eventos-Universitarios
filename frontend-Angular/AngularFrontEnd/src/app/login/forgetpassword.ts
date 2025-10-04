import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service'; // Updated path

@Component({
  selector: 'app-forgetpassword',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgetpassword.html',
  styleUrls: ['./forgetpassword.css']
})
export class ForgetPasswordComponent {
  forgetPasswordForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  sendPwd() {
    if (this.forgetPasswordForm.valid) {
      console.log('Recuperación de contraseña enviada a:', this.forgetPasswordForm.value.email);
      // Example: this.authService.sendPasswordResetEmail(this.forgetPasswordForm.value.email);
    }
  }
}