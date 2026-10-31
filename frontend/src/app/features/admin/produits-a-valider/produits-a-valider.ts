import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProduitService, Produit } from '../../../core/services/produit';
import { CategorieService, Categorie } from '../../../core/services/categorie';

@Component({
  selector: 'app-produits-a-valider',
  imports: [],
  templateUrl: './produits-a-valider.html',
  styleUrl: './produits-a-valider.css',
})
export class ProduitsAValider implements OnInit {
  produits: Produit[] = [];
  categories: Categorie[] = [];
  loading = true;
  errorMessage = '';
  successMessage = '';

  constructor(
    private produitService: ProduitService,
    private categorieService: CategorieService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.charger();
    this.categorieService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.cdr.markForCheck();
      },
      error: () => {
        // Les noms de catégories sont facultatifs : on ignore l'erreur
      },
    });
  }

  charger() {
    this.loading = true;
    this.produitService.getEnAttente().subscribe({
      next: (produits) => {
        this.produits = produits;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Impossible de charger les produits en attente.';
        this.cdr.markForCheck();
      },
    });
  }

  nomCategorie(p: Produit): string {
    return this.categories.find((c) => c.id === p.categorie_id)?.nom ?? '—';
  }

  nomAgriculteur(p: Produit): string {
    const a = p.agriculteur;
    if (!a) return '—';
    return a.prenom ? `${a.prenom} ${a.nom ?? ''}`.trim() : a.name ?? '—';
  }

  valider(p: Produit) {
    this.errorMessage = '';
    this.successMessage = '';

    this.produitService.valider(p.id!).subscribe({
      next: () => {
        this.successMessage = `« ${p.nom_produit} » est validé : les acheteurs peuvent maintenant le voir.`;
        this.charger();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors de la validation.';
        this.cdr.markForCheck();
      },
    });
  }

  refuser(p: Produit) {
    if (!confirm(`Refuser « ${p.nom_produit} » ?`)) return;

    this.errorMessage = '';
    this.successMessage = '';

    this.produitService.refuser(p.id!).subscribe({
      next: () => {
        this.successMessage = `« ${p.nom_produit} » a été refusé.`;
        this.charger();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors du refus.';
        this.cdr.markForCheck();
      },
    });
  }
}