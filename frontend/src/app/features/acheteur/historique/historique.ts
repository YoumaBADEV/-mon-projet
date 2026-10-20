import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VenteService, Vente } from '../../../core/services/vente';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-historique',
  imports: [DatePipe, RouterLink],
  templateUrl: './historique.html',
  styleUrl: './historique.css',
})
export class Historique implements OnInit {
  ventes: Vente[] = [];
  errorMessage = '';

  constructor(
    private venteService: VenteService,
    private authService: Auth,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();
    this.venteService.getAll().subscribe({
      next: (ventes) => {
        // Le backend renvoie toutes les ventes : on ne garde que celles de l'acheteur connecté
        this.ventes = ventes.filter((v) => v.acheteur_id === user?.id);
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = "Impossible de charger l'historique.";
        this.cdr.markForCheck();
      },
    });
  }

  get total(): number {
    return this.ventes.reduce((somme, v) => somme + Number(v.prix_final), 0);
  }
}