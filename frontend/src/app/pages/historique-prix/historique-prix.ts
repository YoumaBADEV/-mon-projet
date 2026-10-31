import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);
  historique: HistoriquePrixRecord[] = [];
  chargement = true;
  erreur = '';

  ngOnInit(): void {
    this.service.obtenirHistorique().subscribe({
      next: (donnees) => {
        // Accepte un tableau direct ou une réponse du type { data: [...] }
        this.historique = Array.isArray(donnees)
          ? donnees
          : ((donnees as any)?.data ?? []);
        this.chargement = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.erreur = 'Impossible de charger les prix. Vérifiez que Laravel est démarré.';
        this.chargement = false;
        this.cdr.markForCheck();
      },
    });
  }
}