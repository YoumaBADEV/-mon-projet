import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Stats {
  utilisateurs: { total: number; agriculteurs: number; acheteurs: number; admins: number };
  produits: { total: number; en_attente: number; disponible: number; vendu: number; refuse: number };
  ventes: { total: number; chiffre_affaires: number };
}

@Component({
  selector: 'app-admin',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  stats: Stats | null = null;
  erreur = '';

  ngOnInit(): void {
    this.http.get<Stats>('http://127.0.0.1:8000/api/admin/stats').subscribe({
      next: (s) => { this.stats = s; this.cdr.markForCheck(); },
      error: () => {
        this.erreur = 'Impossible de charger les statistiques.';
        this.cdr.markForCheck();
      },
    });
  }
}
