import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../interfaces/usuario.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$: Observable<Usuario | null> = this.currentUserSubject.asObservable();
  
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor(private router: Router, private http: HttpClient) {
    this.checkUserInStorage();
  }

  private checkUserInStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.currentUserSubject.next(user);
      this.loggedInSubject.next(true);
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post('http://localhost:8000/api/login', { email, contraseña: password }).pipe(
      tap((response: any) => {
        // Guarda el token si existe
        if (response.access_token) {
          this.saveToken(response.access_token);
        }
        // Guarda el usuario en localStorage y actualiza el estado
        if (response.user) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
          this.loggedInSubject.next(true);
        }
      })
    );
  }

  // Afegeix aquest mètode per guardar el token
  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  register(user: Usuario): Observable<any> {
    // Envia una petició POST al backend per registrar l'usuari
    return this.http.post('http://localhost:8000/api/register', user);
  }

  // Add this method if it doesn't exist or fix it if it's incorrectly implemented
  updateCurrentUser(user: Usuario): void {
    // Update in localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Update in the BehaviorSubject
    this.currentUserSubject.next(user);
    
    // Also update in the users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const index = users.findIndex((u: Usuario) => u.email === user.email);
    
    if (index !== -1) {
      users[index] = { ...users[index], ...user };
      localStorage.setItem('users', JSON.stringify(users));
    }
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    
    this.currentUserSubject.next(null);
    this.loggedInSubject.next(false);
    
    this.router.navigate(['/']);
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }
}