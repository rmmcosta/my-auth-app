import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ResourceInfo {
  id: string;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class ResourceService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getResource(): Observable<ResourceInfo> {
    return this.http.get<ResourceInfo>(`${this.apiUrl}/resource`);
  }
}
