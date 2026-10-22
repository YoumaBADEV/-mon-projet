import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoriquePrixService, HistoriquePrixRecord } from '../../services/historique-prix.service';

@Component({
  selector: 'app-historique-prix',
  imports: [CommonModule],
  templateUrl: './historique-prix.html',
  styleUrl: './historique-prix.css',
})
export class HistoriquePrix implements OnInit {
  private service = inject(HistoriquePrixService);
  historique: HistoriquePrixRecord[] = [];
  chargement = true;
  erreur = '';

  ngOnInit(): void {
    this.service.obtenirHistorique().subscribe({
      next: (donnees) => {
        this.historique = donnees;
        this.chargement = false;
      },
      error: () => {
        this.erreur = 'Impossible de charger les prix. Vérifiez que Laravel est démarré.';
        this.chargement = false;
      }
    });
  }
}
