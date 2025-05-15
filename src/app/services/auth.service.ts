import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
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
        if (response && response.access_token) { 
          localStorage.setItem('access_token', response.access_token);
          this.saveToken(response.access_token);
          console.log('Token guardat:', response.access_token.substring(0, 10) + '...'); 
        }
        // Guarda el usuario en localStorage y actualiza el estado
        if (response.user) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
          this.loggedInSubject.next(true);
          
          // Log para depuración
          console.log('Usuario logueado:', response.user);
          console.log('Rol del usuario:', response.user.rol);
          
          // Redirigir según el rol del usuario
          if (response.user.rol && response.user.rol.toLowerCase() === 'vendedor') {
            console.log('Redirigiendo a /vendedor');
            this.router.navigate(['/vendedor']);
          } else {
            console.log('Redirigiendo a /');
            this.router.navigate(['/']);
          }
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
    return this.http.post('http://localhost:8000/api/register', user).pipe(
      tap((response: any) => {
        // Si el registro es exitoso y devuelve un token y datos de usuario
        if (response.access_token) {
          this.saveToken(response.access_token);
        }
        if (response.user) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
          this.loggedInSubject.next(true);
          
          // Redirigir según el rol del usuario
          if (response.user.rol && response.user.rol.toLowerCase() === 'vendedor') {
            this.router.navigate(['/vendedor']);
          } else {
            this.router.navigate(['/']);
          }
        }
      })
    );
  }

  // Add this method if it doesn't exist or fix it if it's incorrectly implemented
  updateCurrentUser(userData: any): Observable<any> {
    // Actualitzar l'usuari a localStorage
    localStorage.setItem('current_user', JSON.stringify(userData));
    
    const token = localStorage.getItem('auth_token');
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
  
  isVendedor(): boolean {
    const user = this.getCurrentUser();
    return user?.rol?.toLowerCase() === 'vendedor';
  }
}