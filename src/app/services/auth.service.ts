import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface UserInfo {
  username: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';
  isAuthenticated = signal<boolean>(!!localStorage.getItem('credentials'));

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    const credentials = btoa(`${username}:${password}`);
    return this.http
      .get(`${this.apiUrl}/user/info`, {
        headers: { Authorization: `Basic ${credentials}` },
      })
      .pipe(
        tap(() => {
          localStorage.setItem('credentials', credentials);
          this.isAuthenticated.set(true);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('credentials');
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getUserInfo(): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.apiUrl}/user/info`);
  }

  getCredentials(): string | null {
    return localStorage.getItem('credentials');
  }
}
