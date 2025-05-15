import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const VendedorGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.getCurrentUser();

  // Make the role check case-insensitive to match the component
  if (currentUser && currentUser.rol?.toLowerCase() === 'vendedor') {
    return true;
  }

  // Si no es vendedor, redirigir a la página principal
  router.navigate(['/']);
  return false;
};

// Also export as vendedorGuard for backward compatibility
export const vendedorGuard = VendedorGuard;