// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const provider = authService.getAuthProvider();

  // Skip interceptor for OAuth2 redirect
  if (req.url.includes('/oauth2/authorize')) {
    return next(req);
  }

  if (token) {
    // Clone the request and add the authorization header
    const authReq = req.clone({
      headers: req.headers
        .set(
          'Authorization',
          provider === 'basic' ? `Basic ${token}` : `Bearer ${token}`
        )
        .set('X-Requested-With', 'XMLHttpRequest'),
    });
    return next(authReq);
  }

  return next(req);
};
