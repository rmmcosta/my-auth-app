// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Skip interceptor for OAuth2 redirect and login
  if (
    req.url.includes('/oauth2/authorize') ||
    req.url.includes('/auth/basic')
  ) {
    return next(req);
  }

  if (token) {
    // Always use Bearer token for authenticated requests
    const authReq = req.clone({
      headers: req.headers
        .set('Authorization', `Bearer ${token}`)
        .set('X-Requested-With', 'XMLHttpRequest'),
    });
    return next(authReq);
  }

  return next(req);
};
