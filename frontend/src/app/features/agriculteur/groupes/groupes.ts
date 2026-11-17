import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-groupes',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h3 class="mb-1">Groupes d'agriculteurs</h3>
    <p class="text-muted">Créez un groupe ou rejoignez celui d'autres agriculteurs.</p>

    @if (error) { <div class="alert alert-danger">{{ error }}</div> }
    @if (success) { <div class="alert alert-success">{{ success }}</div> }

    <div class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">{{ editId ? 'Modifier le groupe' : 'Créer un groupe' }}</h5>
        <div class="row g-2">
          <div class="col-md-4">
            <input class="form-control" placeholder="Nom du groupe" [(ngModel)]="nom" />
          </div>
          <div class="col-md-5">
            <input class="form-control" placeholder="Description (facultatif)" [(ngModel)]="description" />
          </div>
          <div class="col-md-3 d-flex gap-2">
            <button class="btn btn-success" (click)="enregistrer()">{{ editId ? 'Enregistrer' : 'Créer' }}</button>
            @if (editId) { <button class="btn btn-outline-secondary" (click)="annuler()">Annuler</button> }
          </div>
        </div>
      </div>
    </div>

    <div class="row g-3">
      @for (g of groupes; track g.id) {
        <div class="col-md-6 col-lg-4">
          <div class="card h-100">
            <div class="card-body d-flex flex-column">
              <div class="d-flex justify-content-between align-items-start">
                <h5 class="card-title mb-1">{{ g.nom }}</h5>
                @if (g.est_membre) {
                  <span class="badge bg-success">{{ g.mon_role }}</span>
                }
              </div>
              <p class="text-muted small mb-2">{{ g.description || 'Pas de description.' }}</p>
              <div class="small mb-3">
                👥 {{ g.nb_membres }} membre(s) · créé par
                {{ g.createur?.prenom }} {{ g.createur?.nom || g.createur?.name }}
              </div>
              <div class="mt-auto d-flex gap-2">
                @if (!g.est_membre) {
                  <button class="btn btn-sm btn-success" (click)="rejoindre(g)">Rejoindre</button>
                } @else if (g.createur_id !== moi) {
                  <button class="btn btn-sm btn-outline-danger" (click)="quitter(g)">Quitter</button>
                }
                @if (g.createur_id === moi) {
                  <button class="btn btn-sm btn-outline-primary" (click)="modifier(g)">Modifier</button>
                }
              </div>
            </div>
          </div>
        </div>
      } @empty {
        <p class="text-muted">Aucun groupe pour le moment. Créez le premier !</p>
      }
    </div>
  `,
})
export class Groupes implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private auth = inject(Auth);
  private api = 'http://127.0.0.1:8000/api/groupes';

  moi = this.auth.getUser()?.id;
  groupes: any[] = [];
  nom = '';
  description = '';
  editId: number | null = null;
  error = '';
  success = '';

  ngOnInit() { this.charger(); }

  charger() {
    this.http.get<any[]>(this.api).subscribe({
      next: (data) => { this.groupes = data; this.cdr.markForCheck(); },
      error: () => { this.error = 'Impossible de charger les groupes.'; this.cdr.markForCheck(); },
    });
  }

  private erreurApi(e: any, defaut: string) {
    this.error = e.error?.message || defaut;
    this.cdr.markForCheck();
  }

  enregistrer() {
    this.error = ''; this.success = '';
    if (!this.nom.trim()) { this.error = 'Le nom du groupe est obligatoire.'; return; }

    const body = { nom: this.nom.trim(), description: this.description.trim() || null };
    const req = this.editId
      ? this.http.put(`${this.api}/${this.editId}`, body)
      : this.http.post(this.api, body);

    req.subscribe({
      next: () => {
        this.success = this.editId ? 'Groupe modifié.' : 'Groupe créé : vous en êtes le responsable.';
        this.annuler();
        this.charger();
      },
      error: (e) => this.erreurApi(e, 'Opération impossible.'),
    });
  }

  modifier(g: any) {
    this.editId = g.id; this.nom = g.nom; this.description = g.description || '';
    this.error = ''; this.success = '';
  }

  annuler() {
    this.editId = null; this.nom = ''; this.description = '';
    this.cdr.markForCheck();
  }

  rejoindre(g: any) {
    this.error = ''; this.success = '';
    this.http.post(`${this.api}/${g.id}/participer`, {}).subscribe({
      next: () => { this.success = `Vous participez maintenant à « ${g.nom} ».`; this.charger(); },
      error: (e) => this.erreurApi(e, 'Impossible de rejoindre ce groupe.'),
    });
  }

  quitter(g: any) {
    if (!confirm(`Quitter le groupe « ${g.nom} » ?`)) return;
    this.error = ''; this.success = '';
    this.http.delete(`${this.api}/${g.id}/participer`).subscribe({
      next: () => { this.success = 'Vous avez quitté le groupe.'; this.charger(); },
      error: (e) => this.erreurApi(e, 'Impossible de quitter ce groupe.'),
    });
  }
}
