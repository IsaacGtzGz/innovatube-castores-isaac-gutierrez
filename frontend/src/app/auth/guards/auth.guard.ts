import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  // Inyección de Dependencias
  const router = inject(Router);
  const token = localStorage.getItem('token');

  // Validación de Estado
  if (token) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
