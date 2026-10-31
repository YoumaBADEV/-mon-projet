import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Produit {
  id?: number;
  agriculteur_id?: number;
  nom_produit: string;
  description?: string | null;
  categorie_id?: number | null;
  quantite: number;
  unite?: string;
  prix_propose: number;
  localisation?: string;
  statut?: string;
  agriculteur?: {
    id: number;
    nom?: string | null;
    prenom?: string | null;
    name?: string | null;
    telephone?: string | null;
    email?: string;
  };
  categorie?: { id: number; nom: string } | null;
}

@Injectable({
  providedIn: 'root',
})
export class ProduitService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  // Produits disponibles (liste publique pour les acheteurs)
  getAll(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/produits`);
  }

  // Tous les produits de l'agriculteur connecté (vendus, en attente, refusés compris)
  getMesProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/mes-produits`);
  }

  getOne(id: number): Observable<Produit> {
    return this.http.get<Produit>(`${this.apiUrl}/produits/${id}`);
  }

  create(produit: Produit): Observable<{ message: string; produit: Produit }> {
    return this.http.post<{ message: string; produit: Produit }>(`${this.apiUrl}/produits`, produit);
  }

  update(id: number, produit: Partial<Produit>): Observable<Produit> {
    return this.http.put<Produit>(`${this.apiUrl}/produits/${id}`, produit);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/produits/${id}`);
  }

  // --- Administration : validation des produits ---

  getEnAttente(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/admin/produits/en-attente`);
  }

  valider(id: number): Observable<{ message: string; produit: Produit }> {
    return this.http.put<{ message: string; produit: Produit }>(
      `${this.apiUrl}/admin/produits/${id}/valider`,
      {},
    );
  }

  refuser(id: number): Observable<{ message: string; produit: Produit }> {
    return this.http.put<{ message: string; produit: Produit }>(
      `${this.apiUrl}/admin/produits/${id}/refuser`,
      {},
    );
  }
}