import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { ProduitService } from '../../core/services/produit';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  nbProduits = 0;
  connecte = false;
  espacePath = '/login';

  constructor(
    private authService: Auth,
    private produitService: ProduitService,
    private cdr: ChangeDetectorRef,
  ) {
    const user = this.authService.getUser();
    if (this.authService.getToken() && user) {
      this.connecte = true;
      this.espacePath =
        user.role === 'agriculteur' ? '/agriculteur' : user.role === 'acheteur' ? '/acheteur' : '/login';
    }
  }

  ngOnInit() {
    this.produitService.getAll().subscribe({
      next: (produits) => {
        this.nbProduits = produits.length;
        this.cdr.markForCheck();
      },
      error: () => {
        // Le compteur est facultatif : on ignore l'erreur
      },
    });
  }
}