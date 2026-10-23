import { Routes } from '@angular/router';

import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';

import { Dashboard as AgriculteurDashboard } from './features/agriculteur/dashboard/dashboard';
import { MesRecoltes } from './features/agriculteur/mes-recoltes/mes-recoltes';

import { Dashboard as AcheteurDashboard } from './features/acheteur/dashboard/dashboard';
import { ConsulterPrix } from './features/acheteur/consulter-prix/consulter-prix';
import { Historique } from './features/acheteur/historique/historique';
import { Layout } from './shared/layout/layout';
import { authGuard } from './core/guards/auth-guard';
import { Home } from './features/home/home';

import { Admin } from './pages/admin/admin';
import { HistoriquePrix } from './pages/historique-prix/historique-prix';

export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' },

  // Authentification sans le layout
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // Pages avec le layout partagé
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: 'agriculteur',
        component: AgriculteurDashboard,
        canActivate: [authGuard],
        data: { roles: ['agriculteur'] },
      },
      {
        path: 'agriculteur/mes-recoltes',
        component: MesRecoltes,
        canActivate: [authGuard],
        data: { roles: ['agriculteur'] },
      },
      {
        path: 'acheteur',
        component: AcheteurDashboard,
        canActivate: [authGuard],
        data: { roles: ['acheteur'] },
      },
      {
        path: 'acheteur/consulter-prix',
        component: ConsulterPrix,
        canActivate: [authGuard],
        data: { roles: ['acheteur'] },
      },
      {
        path: 'acheteur/historique',
        component: Historique,
        canActivate: [authGuard],
        data: { roles: ['acheteur'] },
      },
      {
        path: 'admin',
        component: Admin,
        canActivate: [authGuard],
        data: { roles: ['admin'] },
      },
      {
        path: 'historique-prix',
        component: HistoriquePrix,
        canActivate: [authGuard],
        data: { roles: ['admin'] },
      },
    ],
  },

  { path: '**', redirectTo: 'login' },
];import { Routes } from '@angular/router';

import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';

import { Dashboard as AgriculteurDashboard } from './features/agriculteur/dashboard/dashboard';
import { MesRecoltes } from './features/agriculteur/mes-recoltes/mes-recoltes';

import { Dashboard as AcheteurDashboard } from './features/acheteur/dashboard/dashboard';
import { ConsulterPrix } from './features/acheteur/consulter-prix/consulter-prix';
import { Historique } from './features/acheteur/historique/historique';
import { Layout } from './shared/layout/layout';
import { authGuard } from './core/guards/auth-guard';
import { Home } from './features/home/home';

import { Admin } from './pages/admin/admin';
import { HistoriquePrix } from './pages/historique-prix/historique-prix';

export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' },

  // Authentification sans le layout
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // Pages avec le layout partagé
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: 'agriculteur',
        component: AgriculteurDashboard,
        canActivate: [authGuard],
        data: { roles: ['agriculteur'] },
      },
      {
        path: 'agriculteur/mes-recoltes',
        component: MesRecoltes,
        canActivate: [authGuard],
        data: { roles: ['agriculteur'] },
      },
      {
        path: 'acheteur',
        component: AcheteurDashboard,
        canActivate: [authGuard],
        data: { roles: ['acheteur'] },
      },
      {
        path: 'acheteur/consulter-prix',
        component: ConsulterPrix,
        canActivate: [authGuard],
        data: { roles: ['acheteur'] },
      },
      {
        path: 'acheteur/historique',
        component: Historique,
        canActivate: [authGuard],
        data: { roles: ['acheteur'] },
      },
      {
        path: 'admin',
        component: Admin,
        canActivate: [authGuard],
        data: { roles: ['admin'] },
      },
      {
        path: 'historique-prix',
        component: HistoriquePrix,
        canActivate: [authGuard],
        data: { roles: ['admin'] },
      },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
