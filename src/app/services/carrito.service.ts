import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
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
  private authService!: AuthService;

  constructor(
    private http: HttpClient,
    private productosService: ProductosService,
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

  sincronitzarCarretAmbBackend(productes: any[]) {
    return this.http.post(`${this.apiUrl}/cart/add`, { productes });
  }

  obtenirCarretBackend() {
    return this.http.get(`${this.apiUrl}/cart`);
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
      // Verificar que la cantidad no exceda el stock disponible
      const stockDisponible = this.productosService.getStock(id);
      if (cantidad > stockDisponible) {
        console.error(`No se puede añadir más de ${stockDisponible} unidades de este producto`);
        // Limitar la cantidad al stock disponible
        item.cantidad = stockDisponible;
      } else {
        item.cantidad = cantidad;
        if (item.cantidad <= 0) {
          this.eliminarProducto(id);
          return;
        }
      }
      this.actualizarCarrito();
    }
  }

  agregarProducto(producto: Producto, cantidad: number = 1): boolean {
    if (!producto) {
      console.error('Intentando añadir un producto nulo al carrito');
      return false;
    }
    
    // Obtener el stock disponible
    const stockDisponible = this.productosService.getStock(producto.id ?? 0);
    
    // Check if product has enough stock
    if (!this.productosService.checkStock(producto.id ?? 0, cantidad)) {
      console.error('No hay suficiente stock disponible');
      return false;
    }
    
    console.log('Añadiendo producto al carrito:', producto, 'cantidad:', cantidad);
    
    const itemExistente = this.carritoItems.find(item => item.id === producto.id);
    
    if (itemExistente) {
      // Calcular la nueva cantidad total
      const nuevaCantidad = itemExistente.cantidad + cantidad;
      
      // Verificar si la nueva cantidad excede el stock disponible
      if (nuevaCantidad > stockDisponible) {
        console.error(`No se puede añadir más de ${stockDisponible} unidades de este producto`);
        return false;
      }
      
      // Check if we can add more of this product
      if (!this.productosService.checkStock(producto.id ?? 0, nuevaCantidad)) {
        console.error('No hay suficiente stock disponible para la cantidad total');
        return false;
      }
      
      itemExistente.cantidad = nuevaCantidad;
      console.log('Producto ya existente, actualizando cantidad a:', itemExistente.cantidad);
    } else {
      this.carritoItems.push({ ...producto, cantidad });
      console.log('Nuevo producto añadido al carrito');
    }
    
    this.actualizarCarrito();
    
    // Sincronizar con el backend si el usuario está autenticado
    if (this.authService.isLoggedIn()) {
      this.http.post(`${this.apiUrl}/cart/add`, {
        producto_id: producto.id,
        cantidad: cantidad
      }).subscribe(
        response => console.log('Producto sincronizado con el backend', response),
        error => console.error('Error al sincronizar con el backend', error)
      );
    }
    
    return true;
  }

  // Add a method to process checkout and reduce stock
  // Añadir después del método calcularEnvio()
  procesarCompra(): boolean {
    try {
      // Aquí podrías añadir lógica para verificar stock, procesar pago, etc.
      console.log('Procesando compra...');
      
      // Verificar que hay productos en el carrito
      if (this.carritoItems.length === 0) {
        console.error('No hay productos en el carrito');
        return false;
      }
      
      console.log('Procesando compra con', this.carritoItems.length, 'productos');
      
      // Verificar stock antes de procesar la compra
      for (const item of this.carritoItems) {
        if (item.id && !this.productosService.checkStock(item.id, item.cantidad)) {
          console.error(`No hay suficiente stock para ${item.nombre}`);
          return false;
        }
      }
      
      // Reducir stock para todos los productos
      for (const item of this.carritoItems) {
        if (item.id) {
          this.productosService.reducirStock(item.id, item.cantidad);
        }
      }
      
      // Vaciar el carrito después de procesar la compra
      console.log('Compra procesada correctamente, vaciando carrito...');
      
      // Vaciar el array de items directamente
      this.carritoItems = [];
      
      // Actualizar el BehaviorSubject con un array vacío
      this.carritoSubject.next([]);
      
      // Eliminar del localStorage
      localStorage.removeItem('carrito');
      
      console.log('Carrito vaciado, estado actual:', this.carritoItems.length, 'productos');
      
      return true; // Compra exitosa
    } catch (error) {
      console.error('Error al procesar la compra:', error);
      return false; // Compra fallida
    }
  }

  eliminarProducto(id: number): void {
    this.carritoItems = this.carritoItems.filter(item => item.id !== id);
    this.actualizarCarrito();
  }

  vaciarCarrito(): void {
    console.log('Vaciando carrito desde el servicio...');
    
    // Vaciar el array de items
    this.carritoItems = [];
    
    // Forzar la actualización del BehaviorSubject con un nuevo array vacío
    this.carritoSubject.next([]);
    
    // Eliminar del localStorage
    localStorage.removeItem('carrito');
    
    console.log('Carrito vaciado, estado actual:', this.carritoItems.length, 'productos');
  }

  obtenerTotal(): number {
    return this.carritoItems.reduce((total, item) => 
      total + (item.precio || 0) * item.cantidad, 0);
  }

  obtenerCantidadTotal(): number {
    return this.carritoItems.reduce((total, item) => total + item.cantidad, 0);
  }

  private actualizarCarrito(): void {
    console.log('Actualizando carrito con:', this.carritoItems.length, 'items');
    
    // Crear una copia nueva del array para asegurar que se detecta el cambio
    const carritoActualizado = [...this.carritoItems];
    
    // Actualizar el BehaviorSubject con la nueva copia
    this.carritoSubject.next(carritoActualizado);
    
    // Actualizar localStorage
    localStorage.setItem('carrito', JSON.stringify(carritoActualizado));
    
    console.log('Carrito actualizado en localStorage');
  }

  calcularEnvio(): number {
    const subtotal = this.obtenerTotal();
    // Envío gratis para compras superiores a 50€
    return subtotal > 50 ? 0 : 4.99;
  }
}