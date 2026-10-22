import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
  id: number;
  nom?: string | null;
  prenom?: string | null;
  name?: string | null;
  email: string;
  role: string;
  telephone?: string | null;
  localisation?: string | null;
  adresse?: string | null;
}

interface AuthResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  register(data: {
    nom: string;
    prenom: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
    telephone?: string;
    localisation?: string;
    adresse?: string;
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

  getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Prénom + nom, ou l'ancien champ "name" pour les comptes créés avant le changement
  getUserName(): string {
    const u = this.getUser();
    if (!u) return '';
    const complet = [u.prenom, u.nom].filter(Boolean).join(' ');
    return complet || u.name || '';
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}