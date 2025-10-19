import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { SignInComponent } from './login/sign-in';
import { SignUpComponent } from './login/sign-up';
import { ForgetPasswordComponent } from './login/forgetpassword';
import { ProfileMenuComponent } from './profile-menu/profile-menu';
import { ProfileComponent } from './profile/profile';
import { AddEventComponent } from './add-event/add-event';
import { NuevaOrgaExtComponent } from './nueva-orga-ext/nueva-orga-ext';
import { AuthGuard } from './services/auth.guard';


export const routes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'forgetpassword', component: ForgetPasswordComponent },
  { path: 'profile-menu', component: ProfileMenuComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'add-event', component: AddEventComponent, canActivate: [AuthGuard] },
  { path: 'new-organ-ext', component: NuevaOrgaExtComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'signin' }
];
