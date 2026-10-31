import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProduitService, Produit } from '../../../core/services/produit';
import { CategorieService, Categorie } from '../../../core/services/categorie';

@Component({
  selector: 'app-mes-recoltes',
  imports: [FormsModule],
  templateUrl: './mes-recoltes.html',
  styleUrl: './mes-recoltes.css',
})
export class MesRecoltes implements OnInit {
  nom_produit = '';
  description = '';
  categorie_id: number | null = null;
  quantite: number | null = null;
  unite = 'kg';
  prix_propose: number | null = null;
  localisation = '';

  categories: Categorie[] = [];
  mesProduits: Produit[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';

  // Modification en cours
  editingId: number | null = null;
  editNom = '';
  editDescription = '';
  editCategorieId: number | null = null;
  editQuantite: number | null = null;
  editPrix: number | null = null;

  constructor(
    private produitService: ProduitService,
    private categorieService: CategorieService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadProduits();
    this.loadCategories();
  }

  loadCategories() {
    this.categorieService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.cdr.markForCheck();
      },
      error: () => {
        // La catégorie est facultative : on ignore l'erreur
      },
    });
  }

  loadProduits() {
    this.produitService.getMesProduits().subscribe({
      next: (produits) => {
        this.mesProduits = produits;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Impossible de charger tes produits.';
        this.cdr.markForCheck();
      },
    });
  }

  statutClasse(statut?: string): string {
    switch (statut) {
      case 'disponible':
        return 'bg-success';
      case 'vendu':
        return 'bg-secondary';
      case 'en_attente':
        return 'bg-warning text-dark';
      default:
        return 'bg-danger';
    }
  }

  statutLibelle(statut?: string): string {
    if (!statut) return '';
    return statut.replace('_', ' ');
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;

    const produit: Produit = {
      nom_produit: this.nom_produit,
      description: this.description || undefined,
      categorie_id: this.categorie_id ?? undefined,
      quantite: this.quantite!,
      unite: this.unite,
      prix_propose: this.prix_propose!,
      localisation: this.localisation,
    };

    this.produitService.create(produit).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage =
          "Produit ajouté. Il sera visible par les acheteurs après validation par l'administrateur.";
        this.nom_produit = '';
        this.description = '';
        this.categorie_id = null;
        this.quantite = null;
        this.prix_propose = null;
        this.localisation = '';
        this.loadProduits();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || "Erreur lors de l'ajout.";
        this.cdr.markForCheck();
      },
    });
  }

  onEdit(p: Produit) {
    this.errorMessage = '';
    this.successMessage = '';
    this.editingId = p.id!;
    this.editNom = p.nom_produit;
    this.editDescription = p.description ?? '';
    this.editCategorieId = p.categorie_id ?? null;
    this.editQuantite = Number(p.quantite);
    this.editPrix = Number(p.prix_propose);
  }

  onCancelEdit() {
    this.editingId = null;
  }

  onSave(id: number) {
    this.errorMessage = '';
    this.successMessage = '';

    this.produitService.update(id, {
      nom_produit: this.editNom,
      description: this.editDescription || null,
      categorie_id: this.editCategorieId,
      quantite: this.editQuantite!,
      prix_propose: this.editPrix!,
    }).subscribe({
      next: () => {
        this.editingId = null;
        this.successMessage = 'Produit modifié avec succès !';
        this.loadProduits();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors de la modification.';
        this.cdr.markForCheck();
      },
    });
  }

  onDelete(id: number) {
    if (!confirm('Supprimer ce produit ?')) return;

    this.produitService.delete(id).subscribe({
      next: () => this.loadProduits(),
      error: () => {
        this.errorMessage = 'Erreur lors de la suppression.';
        this.cdr.markForCheck();
      },
    });
  }
}