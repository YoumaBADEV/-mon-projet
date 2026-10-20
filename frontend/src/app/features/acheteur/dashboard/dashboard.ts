import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { ProduitService } from '../../../core/services/produit';
import { VenteService, Vente } from '../../../core/services/vente';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  userName = '';
  nbProduits = 0;
  nbAchats = 0;
  totalDepense = 0;
  dernierAchat: Vente | null = null;

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
      this.nbProduits = produits.length;
      this.cdr.markForCheck();
    });

    this.venteService.getAll().subscribe((ventes) => {
      const mesAchats = ventes.filter((v) => v.acheteur_id === user?.id);
      this.nbAchats = mesAchats.length;
      this.totalDepense = mesAchats.reduce((somme, v) => somme + Number(v.prix_final), 0);
      this.dernierAchat = mesAchats[0] ?? null;
      this.cdr.markForCheck();
    });
  }
}