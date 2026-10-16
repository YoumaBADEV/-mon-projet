import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { ProduitService } from '../../../core/services/produit';
import { VenteService } from '../../../core/services/vente';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  userName = '';
  nbProduits = 0;
  valeurStock = 0;
  nbVentes = 0;
  chiffreAffaires = 0;

  constructor(
    private authService: Auth,
    private produitService: ProduitService,
    private venteService: VenteService,
    private cdr: ChangeDetectorRef,
  ) {
    this.userName = this.authService.getUser()?.name || '';
  }

  ngOnInit() {
    const user = this.authService.getUser();

    this.produitService.getAll().subscribe((produits) => {
      const mesProduits = produits.filter((p) => p.agriculteur_id === user?.id);
      this.nbProduits = mesProduits.length;
      this.valeurStock = mesProduits.reduce(
        (somme, p) => somme + Number(p.quantite) * Number(p.prix_propose),
        0,
      );
      this.cdr.markForCheck();
    });

    this.venteService.getAll().subscribe((ventes) => {
      const mesVentes = ventes.filter((v) => v.produit?.agriculteur_id === user?.id);
      this.nbVentes = mesVentes.length;
      this.chiffreAffaires = mesVentes.reduce((somme, v) => somme + Number(v.prix_final), 0);
      this.cdr.markForCheck();
    });
  }
}