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
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const user = users.find((u: Usuario) => 
      u.email === email && u.password === password
    );
    
    if (user) {
      const safeUser = { ...user };
      
      localStorage.setItem('currentUser', JSON.stringify(safeUser));
      
      this.currentUserSubject.next(safeUser);
      this.isLoggedInSubject.next(true);
      
      return true;
    }
    
    if (email === 'test@example.com' && password === 'password') {
      const user: Usuario = {
        nombre: 'Usuario de Prueba',
        email: email,
        password: '', 
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

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    

    const emailExists = users.some((u: Usuario) => u.email === user.email);
    if (emailExists) {
      console.error('Email already registered');
      return false;
    }
    

    users.push(user);
    

    localStorage.setItem('users', JSON.stringify(users));
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.isLoggedInSubject.next(true);
    
    console.log('User registered successfully:', user.email);
    return true;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
    
    this.router.navigate(['/']);
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }
}