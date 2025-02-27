import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/user/components/login/login.component';
import { RegistrationComponent } from './features/user/components/registration/registration.component';
import { ProfileComponent } from './features/profile/profile.component';
import { HomeComponent } from './core/pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  { path: 'auth/register', component: RegistrationComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'account', component: ProfileComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'auth/login' },
];
