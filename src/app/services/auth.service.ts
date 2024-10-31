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
    // Store the basic auth token temporarily
    localStorage.setItem('token', credentials);
    localStorage.setItem('authProvider', 'basic');
    this.authProvider.set('basic');

    // Make the authenticated request to get the user info
    return this.http
      .get<AuthResponse>(`${this.apiUrl}/auth/basic`, { headers })
      .pipe(
        tap({
          next: (response) => {
            if (response.token) {
              // If the server returns a JWT, use that instead
              this.handleAuthSuccess(response.token, 'basic');
            }
          },
          error: () => {
            // Clean up if authentication fails
            this.logout();
          },
        })
      );
  }

  googleLogin(): void {
    // Redirect to Google OAuth endpoint
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

  // Method to check if the current route is public
  isPublicRoute(route: string): boolean {
    const publicRoutes = ['/login', '/auth/callback'];
    return publicRoutes.includes(route);
  }

  // Refreshing user info after token change
  getUserInfo(): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.apiUrl}/user/info`);
  }
}
