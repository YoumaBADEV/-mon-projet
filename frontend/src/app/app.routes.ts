import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Dashboard as AgriculteurDashboard } from './features/agriculteur/dashboard/dashboard';
import { MesRecoltes } from './features/agriculteur/mes-recoltes/mes-recoltes';
import { Dashboard as AcheteurDashboard } from './features/acheteur/dashboard/dashboard';
import { ConsulterPrix } from './features/acheteur/consulter-prix/consulter-prix';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'agriculteur', component: AgriculteurDashboard },
  { path: 'agriculteur/mes-recoltes', component: MesRecoltes },
  { path: 'acheteur', component: AcheteurDashboard },
  { path: 'acheteur/consulter-prix', component: ConsulterPrix },
];