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

  // Connecté, mais pas le bon rôle pour cette page
  const roles = route.data?.['roles'] as string[] | undefined;
  if (roles && !roles.includes(user.role)) {
    if (user.role === 'agriculteur') return router.createUrlTree(['/agriculteur']);
    if (user.role === 'acheteur') return router.createUrlTree(['/acheteur']);
    return router.createUrlTree(['/login']);
  }

  return true;
};