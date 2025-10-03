import { NgModule } from '@angular/core'; 
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in';
import { SignUpComponent } from './sign-up/sign-up';
import { ForgetPasswordComponent } from './forgetpassword/forgetpassword';

export const LoginRoutes: Routes = [
  { path: 'login', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'forgetpassword', component: ForgetPasswordComponent },
];
