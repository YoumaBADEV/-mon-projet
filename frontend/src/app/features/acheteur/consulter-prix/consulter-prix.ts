import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProduitService, Produit } from '../../../core/services/produit';
import { CategorieService, Categorie } from '../../../core/services/categorie';
import { VenteService } from '../../../core/services/vente';

@Component({
  selector: 'app-consulter-prix',
  imports: [FormsModule],
  templateUrl: './consulter-prix.html',
  styleUrl: './consulter-prix.css',
})
export class ConsulterPrix implements OnInit {
  produits: Produit[] = [];
  categories: Categorie[] = [];
  quantites: Record<number, number> = {};
  errorMessage = '';
  successMessage = '';

  recherche = '';
  categorieFiltre: number | null = null;
  localisationFiltre = '';
  tri = '';

  constructor(
    private produitService: ProduitService,
    private categorieService: CategorieService,
    private venteService: VenteService,
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
        // Le filtre par catégorie est facultatif : on ignore l'erreur
      },
    });
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

  get localisations(): string[] {
    const liste = this.produits.map((p) => p.localisation).filter((l): l is string => !!l);
    return [...new Set(liste)].sort();
  }

  get produitsFiltres(): Produit[] {
    let liste = this.produits.filter((p) =>
      p.nom_produit.toLowerCase().includes(this.recherche.toLowerCase().trim()),
    );

    if (this.categorieFiltre !== null) {
      liste = liste.filter((p) => p.categorie_id === this.categorieFiltre);
    }

    if (this.localisationFiltre) {
      liste = liste.filter((p) => p.localisation === this.localisationFiltre);
    }

    if (this.tri === 'asc') {
      liste = [...liste].sort((a, b) => Number(a.prix_propose) - Number(b.prix_propose));
    } else if (this.tri === 'desc') {
      liste = [...liste].sort((a, b) => Number(b.prix_propose) - Number(a.prix_propose));
    }

    return liste;
  }

  reinitialiser() {
    this.recherche = '';
    this.categorieFiltre = null;
    this.localisationFiltre = '';
    this.tri = '';
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
    }).subscribe({
      next: () => {
        this.successMessage = `Achat de ${quantite} ${p.unite} de ${p.nom_produit} enregistré !`;
        this.loadProduits();
        this.cdr.markForCheck();
      },
      error: (err) => {
        const stock = err.error?.stock_disponible;
        this.errorMessage =
          (err.error?.message || "Erreur lors de l'achat.") +
          (stock !== undefined ? ` Stock disponible : ${stock}.` : '');
        this.cdr.markForCheck();
      },
    });
  }
}