import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistoriquePrixService, HistoriquePrixRecord } from '../../services/historique-prix.service';

interface Point { x: number; y: number; prix: number; date: string; }

@Component({
  selector: 'app-historique-prix',
  imports: [FormsModule, DatePipe, DecimalPipe],
  templateUrl: './historique-prix.html',
  styleUrl: './historique-prix.css',
})
export class HistoriquePrix implements OnInit {
  private service = inject(HistoriquePrixService);
  private cdr = inject(ChangeDetectorRef);

  historique: HistoriquePrixRecord[] = [];
  produits: string[] = [];
  produitChoisi = '';
  chargement = true;
  erreur = '';

  // dimensions du graphique
  readonly W = 640;
  readonly H = 260;
  readonly M = { top: 20, right: 20, bottom: 40, left: 70 };

  ngOnInit(): void {
    this.service.obtenirHistorique().subscribe({
      next: (donnees) => {
        this.historique = donnees;
        this.produits = [...new Set(donnees.map((d) => d.nom_produit))].sort();
        this.produitChoisi = this.produits[0] || '';
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

  /** Lignes du produit choisi, de la plus ancienne à la plus récente. */
  get lignes(): HistoriquePrixRecord[] {
    return this.historique
      .filter((h) => h.nom_produit === this.produitChoisi)
      .sort((a, b) => new Date(a.date_calcul).getTime() - new Date(b.date_calcul).getTime());
  }

  get prixMin(): number { return Math.min(...this.lignes.map((l) => +l.prix_moyen)); }
  get prixMax(): number { return Math.max(...this.lignes.map((l) => +l.prix_moyen)); }
  get prixDernier(): number { return +this.lignes[this.lignes.length - 1].prix_moyen; }

  get points(): Point[] {
    const l = this.lignes;
    if (!l.length) return [];
    const min = this.prixMin;
    const max = this.prixMax;
    const plageY = max - min || 1;
    const largeur = this.W - this.M.left - this.M.right;
    const hauteur = this.H - this.M.top - this.M.bottom;
    return l.map((r, i) => ({
      x: this.M.left + (l.length === 1 ? largeur / 2 : (i / (l.length - 1)) * largeur),
      y: this.M.top + hauteur - ((+r.prix_moyen - min) / plageY) * hauteur,
      prix: +r.prix_moyen,
      date: r.date_calcul,
    }));
  }

  get ligneSvg(): string {
    return this.points.map((p) => `${p.x},${p.y}`).join(' ');
  }

  /** Repères horizontaux de l'axe des prix. */
  get reperes(): { y: number; prix: number }[] {
    const min = this.prixMin;
    const max = this.prixMax;
    const hauteur = this.H - this.M.top - this.M.bottom;
    return [0, 0.5, 1].map((t) => ({
      y: this.M.top + hauteur - t * hauteur,
      prix: min + t * (max - min),
    }));
  }

  changerProduit() { this.cdr.markForCheck(); }
}
