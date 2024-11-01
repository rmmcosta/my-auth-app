// services/auth.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface UserInfo {
  username: string;
  roles: string[];
}

export interface AuthResponse {
  token: string;
  type: string;
  username: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';
  isAuthenticated = signal<boolean>(!!localStorage.getItem('token'));
  authProvider = signal<string | null>(localStorage.getItem('authProvider'));

  constructor(private http: HttpClient, private router: Router) {}

  basicLogin(username: string, password: string): Observable<AuthResponse> {
    const credentials = btoa(`${username}:${password}`);
    const headers = new HttpHeaders().set(
      'Authorization',
      `Basic ${credentials}`
    );

    // Note: We're no longer storing the basic auth token
    return this.http
      .get<AuthResponse>(`${this.apiUrl}/auth/basic`, { headers })
      .pipe(
        tap({
          next: (response) => {
            if (response.token) {
              // Store JWT token from response
              this.handleAuthSuccess(response.token, 'basic');
            }
          },
          error: () => {
            this.logout();
          },
        })
      );
  }

  googleLogin(): void {
    window.location.href = `${this.apiUrl}/auth/oauth2/authorize/google`;
  }

  handleAuthCallback(token: string, provider: string): void {
    this.handleAuthSuccess(token, provider);
  }

  private handleAuthSuccess(token: string, provider: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('authProvider', provider);
    this.isAuthenticated.set(true);
    this.authProvider.set(provider);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('authProvider');
    this.isAuthenticated.set(false);
    this.authProvider.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getAuthProvider(): string | null {
    return this.authProvider();
  }

  isPublicRoute(route: string): boolean {
    const publicRoutes = ['/login', '/auth/callback'];
    return publicRoutes.includes(route);
  }

  getUserInfo(): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.apiUrl}/user/info`);
  }
}
