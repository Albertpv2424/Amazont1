import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Producto } from '../interfaces/producto.interface';

// Define an interface for the statistics response
export interface EstadisticasResponse {
  estadisticas: {
    ventasTotales: number;
    productosVendidos: number;
    pedidosCompletados: number;
    valoracionMedia: number;
    productosPopulares: Array<{
      nombre: string;
      unidades: number;
      ingresos: number;
    }>;
  };
}

@Injectable({
  providedIn: 'root'
})
export class VendedorService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Obtener las estadísticas del vendedor - updated with specific return type
  getEstadisticas(): Observable<EstadisticasResponse> {
    return this.http.get<EstadisticasResponse>(`${this.apiUrl}/seller/estadisticas`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener todos los productos del vendedor
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/productos`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener un producto específico
  getProducto(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/vendedor/productos/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Crear un nuevo producto
  crearProducto(producto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/productos`, producto, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }


  // Obtener todas las categorías disponibles
  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categorias`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para obtener los headers con el token de autenticación
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Manejador de errores
  private handleError(error: any) {
    console.error('Error en VendedorService:', error);


    let errorMessage = 'Ha ocurrido un error en el servidor';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status) {
      // Error del lado del servidor
      switch (error.status) {
        case 401:
          errorMessage = 'No tiene autorización para realizar esta acción';
          break;
        case 403:
          errorMessage = 'Acceso prohibido. No tiene permisos de vendedor';
          break;
        case 404:
          errorMessage = 'El recurso solicitado no existe';
          break;
        case 422:
          errorMessage = 'Los datos enviados no son válidos';
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.error.message}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }

  // Actualizar un producto existente
  actualizarProducto(id: number, producto: any): Observable<any> {
    const token = this.authService.getToken();

    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });
      
      // Preparar los datos para enviar
      const datosProducto = {
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock
        // Añadir otros campos según sea necesario
      };
      
      return this.http.put<any>(`${this.apiUrl}/productos/${id}`, datosProducto, {
        headers: headers
      }).pipe(
        catchError(this.handleError)
      );
    }

    return throwError(() => new Error('No hi ha token d\'autenticació disponible'));
  }

  // Eliminar un producto
  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/productos/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }
}