import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface AuthResponse {
  user: { id: number; name: string; email: string; role: string };
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  register(data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
    telephone?: string;
    localisation?: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap((res) => this.saveSession(res))
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => this.saveSession(res))
    );
  }

  private saveSession(res: AuthResponse) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}