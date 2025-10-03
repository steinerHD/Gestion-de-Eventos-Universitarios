import { Routes } from '@angular/router';
import { Home } from './home/home';
import { AddEvent } from './add-event/add-event';
import { SignInComponent } from './login/sign-in/sign-in';
import { SignUpComponent } from './login/sign-up/sign-up';
import { ForgetPasswordComponent } from './login/forgetpassword/forgetpassword';

export const routes: Routes = [
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
  
  // Login y autenticación
  { path: 'sign-in', component: SignInComponent },
  { path: 'forgetpassword', component: ForgetPasswordComponent  },
  { path: 'sign-up', component: SignUpComponent  },

  // Módulos principales
  { path: 'home', component: Home },
  { path: 'add-event', component: AddEvent },

  // Ruta por defecto
  { path: '**', redirectTo: '/sign-in' }
];
