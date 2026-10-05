import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProduitService, Produit } from '../../../core/services/produit';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-mes-recoltes',
  imports: [FormsModule],
  templateUrl: './mes-recoltes.html',
  styleUrl: './mes-recoltes.css',
})
export class MesRecoltes implements OnInit {
  nom_produit = '';
  quantite: number | null = null;
  unite = 'kg';
  prix_propose: number | null = null;
  localisation = '';

  mesProduits: Produit[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private produitService: ProduitService, private authService: Auth) {}

  ngOnInit() {
    this.loadProduits();
  }

  loadProduits() {
    const user = this.authService.getUser();
    this.produitService.getAll().subscribe({
      next: (produits) => {
        this.mesProduits = produits.filter((p) => p.agriculteur_id === user?.id);
      },
      error: () => {
        this.errorMessage = 'Impossible de charger tes produits.';
      },
    });
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;

    const produit: Produit = {
      nom_produit: this.nom_produit,
      quantite: this.quantite!,
      unite: this.unite,
      prix_propose: this.prix_propose!,
      localisation: this.localisation,
    };

    this.produitService.create(produit).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Produit ajouté avec succès !';
        this.nom_produit = '';
        this.quantite = null;
        this.prix_propose = null;
        this.localisation = '';
        this.loadProduits();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || "Erreur lors de l'ajout.";
      },
    });
  }

  onDelete(id: number) {
    if (!confirm('Supprimer ce produit ?')) return;

    this.produitService.delete(id).subscribe({
      next: () => this.loadProduits(),
      error: () => {
        this.errorMessage = 'Erreur lors de la suppression.';
      },
    });
  }
}