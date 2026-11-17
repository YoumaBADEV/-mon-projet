import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Categorie, CategorieService } from '../../../core/services/categorie';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h3 class="mb-3">Gestion des catégories</h3>

    @if (error) { <div class="alert alert-danger">{{ error }}</div> }
    @if (success) { <div class="alert alert-success">{{ success }}</div> }

    <div class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">{{ editId ? 'Modifier la catégorie' : 'Nouvelle catégorie' }}</h5>
        <div class="row g-2">
          <div class="col-md-4">
            <input class="form-control" placeholder="Nom" [(ngModel)]="nom" />
          </div>
          <div class="col-md-5">
            <input class="form-control" placeholder="Description (facultatif)" [(ngModel)]="description" />
          </div>
          <div class="col-md-3 d-flex gap-2">
            <button class="btn btn-success" (click)="enregistrer()">
              {{ editId ? 'Enregistrer' : 'Ajouter' }}
            </button>
            @if (editId) {
              <button class="btn btn-outline-secondary" (click)="annuler()">Annuler</button>
            }
          </div>
        </div>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-hover align-middle">
        <thead class="table-success">
          <tr><th>Nom</th><th>Description</th><th></th></tr>
        </thead>
        <tbody>
          @for (c of categories; track c.id) {
            <tr>
              <td>{{ c.nom }}</td>
              <td>{{ c.description }}</td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-primary me-2" (click)="modifier(c)">Modifier</button>
                <button class="btn btn-sm btn-outline-danger" (click)="supprimer(c)">Supprimer</button>
              </td>
            </tr>
          } @empty {
            <tr><td colspan="3" class="text-center text-muted">Aucune catégorie</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class Categories implements OnInit {
  private api = 'http://127.0.0.1:8000/api/categories';
  categories: Categorie[] = [];
  nom = '';
  description = '';
  editId: number | null = null;
  error = '';
  success = '';

  constructor(
    private http: HttpClient,
    private categorieService: CategorieService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() { this.charger(); }

  charger() {
    this.categorieService.getAll().subscribe({
      next: (data) => { this.categories = data; this.cdr.markForCheck(); },
      error: () => { this.error = 'Impossible de charger les catégories.'; this.cdr.markForCheck(); },
    });
  }

  enregistrer() {
    this.error = ''; this.success = '';
    if (!this.nom.trim()) { this.error = 'Le nom est obligatoire.'; return; }

    const body = { nom: this.nom.trim(), description: this.description.trim() || null };
    const req = this.editId
      ? this.http.put(`${this.api}/${this.editId}`, body)
      : this.http.post(this.api, body);

    req.subscribe({
      next: () => {
        this.success = this.editId ? 'Catégorie modifiée.' : 'Catégorie ajoutée.';
        this.annuler();
        this.charger();
      },
      error: (e) => {
        this.error = e.error?.message || 'Opération impossible (réservée à l’admin).';
        this.cdr.markForCheck();
      },
    });
  }

  modifier(c: Categorie) {
    this.editId = c.id;
    this.nom = c.nom;
    this.description = c.description || '';
    this.success = ''; this.error = '';
  }

  annuler() {
    this.editId = null; this.nom = ''; this.description = '';
    this.cdr.markForCheck();
  }

  supprimer(c: Categorie) {
    if (!confirm(`Supprimer la catégorie « ${c.nom} » ?`)) return;
    this.error = ''; this.success = '';
    this.http.delete(`${this.api}/${c.id}`).subscribe({
      next: () => { this.success = 'Catégorie supprimée.'; this.charger(); },
      error: (e) => {
        this.error = e.error?.message || 'Suppression impossible.';
        this.cdr.markForCheck();
      },
    });
  }
}
