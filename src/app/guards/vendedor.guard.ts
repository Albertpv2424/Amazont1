import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class VendedorGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentUser = this.authService.getCurrentUser();

    // Check role case-insensitively
    if (currentUser && currentUser.rol && currentUser.rol.toLowerCase() === 'vendedor') {
      return true;
    }

    // Si no es vendedor, redirigir a la página principal
    return this.router.createUrlTree(['/']);
  }
}