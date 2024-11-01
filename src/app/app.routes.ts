// app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('./auth-callback/auth-callback.component').then(
        (m) => m.AuthCallbackComponent
      ),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'user',
    loadComponent: () =>
      import('./components/user/user.component').then((m) => m.UserComponent),
    canActivate: [authGuard],
  },
];
