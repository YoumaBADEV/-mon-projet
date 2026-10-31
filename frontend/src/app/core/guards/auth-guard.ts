import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(Auth);
  const router = inject(Router);

  const token = authService.getToken();
  const user = authService.getUser();

  // Pas connecté : retour à la page de connexion
  if (!token || !user) {
    return router.createUrlTree(['/login']);
  }

  // Connecté, mais pas le bon rôle pour cette page : retour à sa propre page d'accueil
  const roles = route.data?.['roles'] as string[] | undefined;
  if (roles && !roles.includes(user.role)) {
    return router.createUrlTree([authService.getHomePath(user.role)]);
  }

  return true;
};