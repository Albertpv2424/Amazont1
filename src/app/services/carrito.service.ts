import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { Producto } from '../interfaces/producto.interface';
import { ProductosService } from './productos.service';
import { AuthService } from './auth.service';

export interface ProductoCarrito extends Producto {
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private apiUrl = 'http://localhost:8000/api';

  private carritoItems: ProductoCarrito[] = [];
  private carritoSubject = new BehaviorSubject<ProductoCarrito[]>([]);

  constructor(
    private http: HttpClient,
    private productosService: ProductosService,
    private authService: AuthService // Afegir aquesta línea
  ) {
    // Cargar carrito desde localStorage al iniciar
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      try {
        this.carritoItems = JSON.parse(carritoGuardado);
        this.carritoSubject.next(this.carritoItems);
        console.log('Carrito cargado desde localStorage:', this.carritoItems);
      } catch (e) {
        console.error('Error parsing cart from localStorage:', e);
        localStorage.removeItem('carrito');
      }
    }
  }

  obtenirCarretBackend(headers: any): Observable<any> {
    return this.http.get('http://localhost:8000/api/cart', { headers });
  }

  getCarrito(): Observable<ProductoCarrito[]> {
    return this.carritoSubject.asObservable().pipe(
      map(items => {
        // Assegurar-nos que sempre retornem un array
        return Array.isArray(items) ? items : [];
      })
    );
  }

  actualizarCantidad(id: number, cantidad: number): void {
    const item = this.carritoItems.find(item => item.id === id);
    if (item) {
      this.productosService.getStock(id).subscribe(stockDisponible => {
        // Move the comparison INSIDE the subscription
        if (stockDisponible !== undefined && cantidad > stockDisponible) {
          console.error(`No se puede añadir más de ${stockDisponible} unidades`);
          item.cantidad = stockDisponible;
        } else {
          item.cantidad = cantidad;
        }
        
        if (item.cantidad <= 0) {
          this.eliminarProducto(id);
          return;
        }
        this.actualizarCarrito();
      });
    }
  }


  obtenerTotal(): number {
    return this.carritoItems.reduce((total, item) => 
      total + ((item.precio || 0) * item.cantidad), 0
    );
  }

  calcularEnvio(): number {
    const subtotal = this.obtenerTotal();
    // Envío gratuito para compras superiores a 100€
    if (subtotal > 100) return 0;
    // Coste fijo de envío de 5.99€
    return 5.99;
  }


 

  eliminarProducto(id: number): void {
    this.carritoItems = this.carritoItems.filter(item => item.id !== id);
    this.actualizarCarrito();
  }

  actualizarCarrito(): void {
    localStorage.setItem('carrito', JSON.stringify(this.carritoItems));
    this.carritoSubject.next(this.carritoItems);
  }

  obtenerCantidadTotal(): number {
    return this.carritoItems.reduce((total, item) => total + item.cantidad, 0);
  }

  vaciarCarrito(): void {
    this.carritoItems = [];
    this.actualizarCarrito();
  }

  getCartFromBackend(): Observable<any> {
    const token = localStorage.getItem('access_token'); // Changed from auth_token
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    return this.http.get(`${this.apiUrl}/cart`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching cart:', error);
        return throwError(() => error);
      })
    );
  }

  addToCart(productId: number, quantity: number): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const body = { 
        producto_id: productId,  // Fixed field name from product_id to producto_id
        cantidad: quantity
    };

    return this.http.post(`${this.apiUrl}/cart/add`, body, { headers }).pipe(
        catchError(error => {
            console.error('Error del servidor:', error.error.errors);
            return throwError(() => error);
        })
    );
}


getStock(id: number): Observable<number> {
  return this.http.get<number>(`${this.apiUrl}/products/${id}/stock`);
}
}