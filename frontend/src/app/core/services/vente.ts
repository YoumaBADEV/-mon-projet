import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vente {
  id?: number;
  produit_id: number;
  quantite_achetee: number;
  prix_final?: number;
  acheteur_id?: number;
  produit?: any;
  created_at?: string;
}

@Injectable({
  providedIn: 'root',
})
export class VenteService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Vente[]> {
    return this.http.get<Vente[]>(`${this.apiUrl}/ventes`);
  }

  create(vente: Vente): Observable<Vente> {
    return this.http.post<Vente>(`${this.apiUrl}/ventes`, vente);
  }
}