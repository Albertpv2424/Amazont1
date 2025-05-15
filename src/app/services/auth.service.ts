import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../interfaces/usuario.interface';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api'; // Añade esta línea

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
      }),
      catchError(error => {
        console.error('Error en login:', error);
        // Log more detailed information about the error
        if (error.error && error.error.message) {
          console.error('Server error message:', error.error.message);
        }
        return throwError(() => error);
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
  updateCurrentUser(userData: any): Observable<any> {
    // Actualitzar l'usuari a localStorage
    localStorage.setItem('currentUser', JSON.stringify(userData)); // Changed from current_user

    const token = localStorage.getItem('access_token'); // Changed from auth_token
    if (token) {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Correcció: Canviar la URL i estructura de dades
      return this.http.put('http://localhost:8000/api/user/shipping-address', {
        ciudad: userData.ciudad,
        pais: userData.pais,
        telefono: userData.telefono
      }, { headers });
    }
    return of(null); // Retornar observable buit si no hi ha token
  }
  getAuthHeaders() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : undefined;
  }

  logout() {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      tap(() => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('access_token');
        localStorage.removeItem('carrito'); // Opcional: limpia el carrito si lo guardas en localStorage

        this.currentUserSubject.next(null);
        this.loggedInSubject.next(false);
      }),
      catchError(error => {
        // En caso de error, limpiamos igualmente los datos locales
        localStorage.removeItem('currentUser');
        localStorage.removeItem('access_token');
        localStorage.removeItem('carrito');

        this.currentUserSubject.next(null);
        this.loggedInSubject.next(false);

        // Devolvemos un observable vacío para que la aplicación continúe
        return of(null);
      })
    );
  }


  removeToken() {
    localStorage.removeItem('access_token');
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }

  // Método para obtener el rol del usuario
  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.rol : null;
  }

  // Método para verificar si el usuario es vendedor
  isVendedor(): boolean {
    const role = this.getUserRole();
    return role?.toLowerCase() === 'vendedor';
  }
}