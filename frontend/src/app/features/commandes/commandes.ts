import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-commandes',
  standalone: true,
  imports: [FormsModule, DatePipe, DecimalPipe],
  template: `
    <h3 class="mb-1">{{ estAcheteur ? 'Mes commandes' : 'Commandes reçues' }}</h3>
    <p class="text-muted">
      {{ estAcheteur ? 'Passez une commande ; l\\'agriculteur la confirmera.' : 'Confirmez les commandes sur vos produits.' }}
    </p>

    @if (error) { <div class="alert alert-danger">{{ error }}</div> }
    @if (success) { <div class="alert alert-success">{{ success }}</div> }

    @if (estAcheteur) {
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">Nouvelle commande</h5>
          <div class="row g-2">
            <div class="col-md-6">
              <select class="form-select" [(ngModel)]="produitId">
                <option [ngValue]="null">Choisir un produit disponible…</option>
                @for (p of produits; track p.id) {
                  <option [ngValue]="p.id">
                    {{ p.nom_produit }} — {{ p.prix_propose | number:'1.0-0' }} FCFA/{{ p.unite || 'kg' }} (stock : {{ p.quantite }})
                  </option>
                }
              </select>
            </div>
            <div class="col-md-3">
              <input type="number" min="0" step="any" class="form-control" placeholder="Quantité" [(ngModel)]="quantite" />
            </div>
            <div class="col-md-3">
              <button class="btn btn-success w-100" (click)="passer()">Passer la commande</button>
            </div>
          </div>
        </div>
      </div>
    }

    <div class="table-responsive">
      <table class="table table-hover align-middle">
        <thead class="table-success">
          <tr>
            <th>Date</th><th>Produit</th>
            <th>{{ estAcheteur ? 'Agriculteur' : 'Acheteur' }}</th>
            <th>Quantité</th><th>Total (FCFA)</th><th>Statut</th><th></th>
          </tr>
        </thead>
        <tbody>
          @for (c of commandes; track c.id) {
            <tr>
              <td>{{ c.date_commande | date:'dd/MM/yyyy' }}</td>
              <td>{{ c.produit?.nom_produit }}</td>
              <td>{{ estAcheteur ? 'Voir produit' : ((c.acheteur?.prenom || '') + ' ' + (c.acheteur?.nom || c.acheteur?.name || '')) }}</td>
              <td>{{ c.quantite_commande }}</td>
              <td>{{ c.prix_total | number:'1.0-0' }}</td>
              <td>
                <span class="badge"
                  [class.bg-warning]="c.statut === 'en_attente'"
                  [class.text-dark]="c.statut === 'en_attente'"
                  [class.bg-success]="c.statut === 'confirmee'"
                  [class.bg-secondary]="c.statut === 'annulee'">
                  {{ libelle(c.statut) }}
                </span>
              </td>
              <td class="text-end">
                @if (c.statut === 'en_attente') {
                  @if (estAcheteur) {
                    <button class="btn btn-sm btn-outline-danger" (click)="annuler(c)">Annuler</button>
                  } @else {
                    <button class="btn btn-sm btn-success" (click)="confirmer(c)">Confirmer</button>
                  }
                }
              </td>
            </tr>
          } @empty {
            <tr><td colspan="7" class="text-center text-muted">Aucune commande</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class Commandes implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private auth = inject(Auth);
  private api = 'http://127.0.0.1:8000/api';

  estAcheteur = this.auth.getUser()?.role === 'acheteur';
  commandes: any[] = [];
  produits: any[] = [];
  produitId: number | null = null;
  quantite: number | null = null;
  error = '';
  success = '';

  ngOnInit() {
    this.charger();
    if (this.estAcheteur) {
      this.http.get<any[]>(`${this.api}/produits`).subscribe({
        next: (p) => { this.produits = p; this.cdr.markForCheck(); },
      });
    }
  }

  charger() {
    this.http.get<any[]>(`${this.api}/commandes`).subscribe({
      next: (data) => { this.commandes = data; this.cdr.markForCheck(); },
      error: () => { this.error = 'Impossible de charger les commandes.'; this.cdr.markForCheck(); },
    });
  }

  libelle(statut: string) {
    return statut === 'en_attente' ? 'En attente' : statut === 'confirmee' ? 'Confirmée' : 'Annulée';
  }

  private erreurApi(e: any, defaut: string) {
    const stock = e.error?.stock_disponible;
    this.error = (e.error?.message || defaut) + (stock !== undefined ? ` (stock : ${stock})` : '');
    this.cdr.markForCheck();
  }

  passer() {
    this.error = ''; this.success = '';
    if (!this.produitId || !this.quantite || this.quantite <= 0) {
      this.error = 'Choisissez un produit et une quantité.';
      return;
    }
    this.http.post(`${this.api}/commandes`, {
      produit_id: this.produitId,
      quantite_commande: this.quantite,
    }).subscribe({
      next: () => {
        this.success = 'Commande envoyée à l\'agriculteur.';
        this.produitId = null; this.quantite = null;
        this.charger();
      },
      error: (e) => this.erreurApi(e, 'Commande impossible.'),
    });
  }

  annuler(c: any) {
    this.error = ''; this.success = '';
    this.http.put(`${this.api}/commandes/${c.id}/annuler`, {}).subscribe({
      next: () => { this.success = 'Commande annulée.'; this.charger(); },
      error: (e) => this.erreurApi(e, 'Annulation impossible.'),
    });
  }

  confirmer(c: any) {
    this.error = ''; this.success = '';
    this.http.put(`${this.api}/commandes/${c.id}/confirmer`, {}).subscribe({
      next: () => { this.success = 'Commande confirmée : la vente est enregistrée.'; this.charger(); },
      error: (e) => this.erreurApi(e, 'Confirmation impossible.'),
    });
  }
}
