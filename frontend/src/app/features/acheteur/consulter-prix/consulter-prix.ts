import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProduitService, Produit } from '../../../core/services/produit';
import { VenteService } from '../../../core/services/vente';

@Component({
  selector: 'app-consulter-prix',
  imports: [FormsModule],
  templateUrl: './consulter-prix.html',
  styleUrl: './consulter-prix.css',
})
export class ConsulterPrix implements OnInit {
  produits: Produit[] = [];
  quantites: Record<number, number> = {};
  errorMessage = '';
  successMessage = '';

  constructor(
    private produitService: ProduitService,
    private venteService: VenteService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadProduits();
  }

  loadProduits() {
    this.produitService.getAll().subscribe({
      next: (produits) => {
        this.produits = produits;
        produits.forEach((p) => {
          if (p.id && !this.quantites[p.id]) this.quantites[p.id] = 1;
        });
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les produits.';
        this.cdr.markForCheck();
      },
    });
  }

  onAcheter(p: Produit) {
    this.errorMessage = '';
    this.successMessage = '';

    const quantite = this.quantites[p.id!];
    if (!quantite || quantite <= 0 || quantite > p.quantite) {
      this.errorMessage = `Quantité invalide (entre 1 et ${p.quantite}).`;
      return;
    }

    this.venteService.create({
      produit_id: p.id!,
      quantite_achetee: quantite,
      prix_final: quantite * p.prix_propose,
    }).subscribe({
      next: () => {
        this.successMessage = `Achat de ${quantite} ${p.unite} de ${p.nom_produit} enregistré !`;
        this.loadProduits();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || "Erreur lors de l'achat.";
        this.cdr.markForCheck();
      },
    });
  }
}