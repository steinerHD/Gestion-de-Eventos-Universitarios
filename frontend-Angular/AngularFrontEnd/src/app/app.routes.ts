import { Routes } from '@angular/router';
<<<<<<< Updated upstream

export const routes: Routes = [];
=======
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NuevaOrgaExt } from './nueva-orga-ext/nueva-orga-ext';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'NewOrganExt', component: NuevaOrgaExt },
  { path: '**', redirectTo: '/login' }
];
>>>>>>> Stashed changes
