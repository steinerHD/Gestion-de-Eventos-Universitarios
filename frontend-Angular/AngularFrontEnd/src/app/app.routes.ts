import { Routes } from '@angular/router';
import { AddEvent } from './add-event/add-event';
import { Home } from './home/home';
import { Login } from './login/login';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  {path: 'home', component: Home },
  { path: 'add-event', component: AddEvent },
  { path: '**', redirectTo: '/login' }

]