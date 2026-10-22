import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Categorie {
  id: number;
  nom: string;
  description?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class CategorieService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${this.apiUrl}/categories`);
  }
}