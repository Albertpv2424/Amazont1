import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Producto } from '../interfaces/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class VendedorService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Obtener headers con token de autenticación
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Obtener todos los productos del vendedor
  getProductos(): Observable<Producto[]> {
    return this.http.get<any>(`${this.apiUrl}/seller/products`, { headers: this.getHeaders() })
      .pipe(
        map(response => {
          if (response && response.status === 'success' && response.productos) {
            return response.productos;
          }
          return [];
        }),
        catchError(error => {
          console.error('Error al obtener productos del vendedor:', error);
          return throwError(() => error);
        })
      );
  }

  // Obtener un producto por ID
  getProducto(id: number): Observable<Producto> {
    return this.http.get<any>(`${this.apiUrl}/products/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(response => {
          if (response && response.status === 'success' && response.producto) {
            return response.producto;
          }
          throw new Error('Producto no encontrado');
        }),
        catchError(error => {
          console.error(`Error al obtener el producto con ID ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  // Crear un nuevo producto
  crearProducto(producto: any): Observable<Producto> {
    return this.http.post<any>(`${this.apiUrl}/products`, producto, { headers: this.getHeaders() })
      .pipe(
        map(response => {
          if (response && response.status === 'success' && response.producto) {
            return response.producto;
          }
          throw new Error('Error al crear el producto');
        }),
        catchError(error => {
          console.error('Error al crear el producto:', error);
          return throwError(() => error);
        })
      );
  }

  // Actualizar un producto existente
  actualizarProducto(id: number, producto: any): Observable<Producto> {
    return this.http.put<any>(`${this.apiUrl}/products/${id}`, producto, { headers: this.getHeaders() })
      .pipe(
        map(response => {
          if (response && response.status === 'success' && response.producto) {
            return response.producto;
          }
          throw new Error('Error al actualizar el producto');
        }),
        catchError(error => {
          console.error(`Error al actualizar el producto con ID ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  // Eliminar un producto
  eliminarProducto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/products/${id}`, { headers: this.getHeaders() })
      .pipe(
        map(response => {
          if (response && response.status === 'success') {
            return true;
          }
          throw new Error('Error al eliminar el producto');
        }),
        catchError(error => {
          console.error(`Error al eliminar el producto con ID ${id}:`, error);
          return throwError(() => error);
        })
      );
  }

  // Obtener categorías para el formulario de productos
  getCategorias(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/categorias`, { headers: this.getHeaders() })
      .pipe(
        map(response => {
          if (response && response.categorias) {
            return response.categorias;
          }
          return [];
        }),
        catchError(error => {
          console.error('Error al obtener categorías:', error);
          return throwError(() => error);
        })
      );
  }

  // Obtener estadísticas de ventas para los productos del vendedor
  getEstadisticasVentas(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/seller/statistics`, { headers: this.getHeaders() })
      .pipe(
        map(response => {
          if (response && response.status === 'success') {
            return response.estadisticas;
          }
          return {};
        }),
        catchError(error => {
          console.error('Error al obtener estadísticas de ventas:', error);
          return throwError(() => error);
        })
      );
  }
}