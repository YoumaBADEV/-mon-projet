import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Auth } from '../../core/services/auth';

interface MenuItem {
  label: string;
  icon: string;
  path: string;
}

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  userName = '';
  role = '';
  menu: MenuItem[] = [];

  constructor(private authService: Auth, private router: Router) {
    const user = this.authService.getUser();
    this.userName = this.authService.getUserName();
    this.role = user?.role || '';

    if (this.role === 'agriculteur') {
      this.menu = [
        { label: 'Tableau de bord', icon: '📊', path: '/agriculteur' },
        { label: 'Mes récoltes', icon: '🌾', path: '/agriculteur/mes-recoltes' },
        { label: 'Commandes reçues', icon: '📦', path: '/agriculteur/commandes' },
        { label: 'Groupes', icon: '🤝', path: '/agriculteur/groupes' },
      ];
    } else if (this.role === 'acheteur') {
      this.menu = [
        { label: 'Tableau de bord', icon: '📊', path: '/acheteur' },
        { label: 'Prix du marché', icon: '💰', path: '/acheteur/consulter-prix' },
        { label: 'Mes commandes', icon: '📦', path: '/acheteur/commandes' },
        { label: 'Mes achats', icon: '🧾', path: '/acheteur/historique' },
      ];
    } else if (this.role === 'admin') {
      this.menu = [
        { label: 'Administration', icon: '🛠️', path: '/admin' },
        { label: 'Produits à valider', icon: '✅', path: '/admin/produits' },
        { label: 'Utilisateurs', icon: '👥', path: '/admin/utilisateurs' },
        { label: 'Catégories', icon: '🏷️', path: '/admin/categories' },
        { label: 'Historique des prix', icon: '📈', path: '/historique-prix' },
      ];
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}