import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';   

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [FormsModule, CommonModule], 
  templateUrl: './login.html', 
  styleUrls: ['./login.css']   
})
export class LoginComponent {
  selectedMenu: 'signin' | 'signup' = 'signin';
  
  // Sign In properties
  signInEmail: string = '';
  signInPassword: string = '';
  
  // Sign Up properties
  signUpName: string = '';
  signUpEmail: string = '';
  signUpFaculty: string = '';
  signUpAcademic: string = '';
  signUpPassword: string = '';
  signUpConfirmPassword: string = '';

  constructor(private router: Router) {}

  onSignIn() {
    console.log('Sign In:', { email: this.signInEmail, password: this.signInPassword });
    this.router.navigate(['/home']); // ✅ Navega al home
  }

  onSignUp() {
    console.log('Sign Up:', {
      name: this.signUpName,
      email: this.signUpEmail,
      faculty: this.signUpFaculty,
      academic: this.signUpAcademic,
      password: this.signUpPassword,
      confirmPassword: this.signUpConfirmPassword
    });
    this.router.navigate(['/home']); // ✅ Navega al home
  }
}
