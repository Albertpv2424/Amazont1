import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$: Observable<Usuario | null> = this.currentUserSubject.asObservable();
  
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private router: Router) {
    // Check if user is stored in localStorage on service initialization
    this.checkUserInStorage();
  }

  private checkUserInStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.currentUserSubject.next(user);
      this.isLoggedInSubject.next(true);
    }
  }

  login(email: string, password: string): boolean {
    // Get all users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find user with matching email and password
    const user = users.find((u: Usuario) => 
      u.email === email && u.password === password
    );
    
    if (user) {
      // Create a safe user object (optional: remove password for security)
      const safeUser = { ...user };
      
      // Store user in localStorage
      localStorage.setItem('currentUser', JSON.stringify(safeUser));
      
      // Update subjects
      this.currentUserSubject.next(safeUser);
      this.isLoggedInSubject.next(true);
      
      return true;
    }
    
    // For demo purposes, also allow the test user
    if (email === 'test@example.com' && password === 'password') {
      const user: Usuario = {
        nombre: 'Usuario de Prueba',
        email: email,
        password: '', // Don't store actual password in memory
        tipoUsuario: 'Cliente',
        aceptaTerminos: true
      };
      
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      this.isLoggedInSubject.next(true);
      
      return true;
    }
    
    return false;
  }

  register(user: Usuario): boolean {
    // Get existing users or initialize empty array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists
    const emailExists = users.some((u: Usuario) => u.email === user.email);
    if (emailExists) {
      console.error('Email already registered');
      return false;
    }
    
    // Add new user to users array
    users.push(user);
    
    // Save updated users array
    localStorage.setItem('users', JSON.stringify(users));
    
    // Set as current user
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.isLoggedInSubject.next(true);
    
    console.log('User registered successfully:', user.email);
    return true;
  }

  logout(): void {
    // Clear user from localStorage
    localStorage.removeItem('currentUser');
    
    // Update subjects
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
    
    // Navigate to home page
    this.router.navigate(['/']);
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }
}