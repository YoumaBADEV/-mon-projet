import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HistoriquePrixRecord {
  id: number;
  nom_produit: string;
  prix_moyen: number;
  region: string | null;
  date_calcul: string;
}

@Injectable({
  providedIn: 'root'
})
export class HistoriquePrixService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api/historique-prix';

  obtenirHistorique(nomProduit?: string): Observable<HistoriquePrixRecord[]> {
    let params = new HttpParams();

    if (nomProduit) {
      params = params.set('nom_produit', nomProduit);
    }

    return this.http.get<HistoriquePrixRecord[]>(this.apiUrl, { params });
  }
}
