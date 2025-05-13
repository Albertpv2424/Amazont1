import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { ProductoCategoria } from '../interfaces/producto-categoria.interface';
import { Producto } from '../interfaces/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = 'http://localhost:8000/api';
  private productos: ProductoCategoria[] = []; // Mantenim la llista local com a cache
  private currentProduct = new BehaviorSubject<Producto | null>(null);

  public currentProduct$: Observable<Producto | null> = this.currentProduct.asObservable();

  constructor(private http: HttpClient) {
    this.cargarProductos();
  }

  private cargarProductos(): void {
    this.http.get<any>(`${this.apiUrl}/products`).pipe(
      map(response => {
        console.log('Resposta de l\'API:', response); // Afegir aquesta línia
        if (response && response.productos) {
          return Array.isArray(response.productos) ? response.productos : [];
        }
        return [];
      }),
      catchError(error => {
        console.error('Error al cargar productos desde la API:', error);
        return of([]);
      })
    ).subscribe(productos => {
      this.productos = productos || [];
      this.initializeStock();
    });
  }

  private initializeStock(): void {
    if (!Array.isArray(this.productos)) {
      console.error('Productos is not an array:', this.productos);
      this.productos = [];
      return;
    }
    
    this.productos.forEach(producto => {
      if (producto.stock === undefined) {
        producto.stock = Math.floor(Math.random() * 25) + 5;
      }
    });
  }

  // Check if a product has enough stock
  checkStock(productoId: number, cantidad: number = 1): boolean {
    const producto = this.productos.find(p => p.id === productoId);
    return producto !== undefined && 
           producto.stock !== undefined && 
           producto.stock >= cantidad;
  }

  // Reduce stock when a product is purchased
  reducirStock(productoId: number, cantidad: number = 1): boolean {
    const producto = this.productos.find(p => p.id === productoId);
    
    if (!producto || producto.stock === undefined || producto.stock < cantidad) {
      return false; // Not enough stock or product not found
    }
    
    producto.stock -= cantidad;
    console.log(`Stock reducido para ${producto.nombre}. Nuevo stock: ${producto.stock}`);
    return true;
  }

  // Get current stock for a product
  getStock(productoId: number): number {
    const producto = this.productos.find(p => p.id === productoId);
    return producto?.stock ?? 0;
  }

  // Existing methods
  getProductosPorCategoria(categoria: string): ProductoCategoria[] {
    return this.productos.filter(producto =>
      producto.categoria.toLowerCase() === categoria.toLowerCase()
    );
  }

  getAllProductos() {
    return this.productos;
  }

  getProductoById(id: string | null): Observable<any> {
    if (!id) return of(null);
    
    // Primer intentem trobar-lo a la cache local
    const productoLocal = this.productos.find(p => p.id === parseInt(id));
    if (productoLocal) {
      return of(productoLocal);
    }
    
    // Si no el trobem, fem una crida a l'API
    return this.http.get<any>(`${this.apiUrl}/products/${id}`).pipe(
      map(response => {
        if (response && response.producto) {
          return response.producto;
        }
        return null;
      }),
      catchError(error => {
        console.error(`Error al obtenir el producte amb ID ${id}:`, error);
        return of(null);
      })
    );
  }

  getOfertones(): ProductoCategoria[] {
    // Filtrem els productes que estan en oferta i tenen preu d'oferta
    return this.productos.filter(producto => 
        producto.en_oferta && producto.precio_oferta !== null && producto.precio_oferta > 0
    );
}

  // Mètode per recarregar els productes des de l'API
  recargarProductos(): Observable<ProductoCategoria[]> {
    return this.http.get<any>(`${this.apiUrl}/products`).pipe(
      map(response => {
        if (response && response.productos) {
          this.productos = response.productos;
          this.initializeStock();
          return this.productos;
        }
        return [];
      }),
      catchError(error => {
        console.error('Error al recargar productos desde la API:', error);
        return of([]);
      })
    );
  }

  getProductosPaginados(page: number = 1): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/products?page=${page}`).pipe(
      map(response => {
        if (response && response.productos) {
          this.productos = response.productos.data;
          this.initializeStock();
          return {
            status: response.status,
            productos: {
              current_page: response.productos.current_page,
              data: response.productos.data,
              first_page_url: response.productos.first_page_url,
              from: response.productos.from,
              last_page: response.productos.last_page,
              last_page_url: response.productos.last_page_url,
              links: response.productos.links,
              next_page_url: response.productos.next_page_url
            }
          };
        }
        return { status: 'error', message: 'No se encontraron productos' };
      }),
      catchError(error => {
        console.error('Error al obtener productos paginados:', error);
        return of({ status: 'error', message: 'Error al obtener productos' });
      })
    );
  }
}
