import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Producto } from '../interfaces/producto.interface';
import { ProductosService } from './productos.service';

export interface ProductoCarrito extends Producto {
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carritoItems: ProductoCarrito[] = [];
  private carritoSubject = new BehaviorSubject<ProductoCarrito[]>([]);
  
  constructor(private productosService: ProductosService) {
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

  getCarrito(): Observable<ProductoCarrito[]> {
    return this.carritoSubject.asObservable();
  }

  agregarProducto(producto: Producto, cantidad: number = 1): boolean {
    if (!producto) {
      console.error('Intentando añadir un producto nulo al carrito');
      return false;
    }
    
    // Check if product has enough stock
    if (!this.productosService.checkStock(producto.id ?? 0, cantidad)) {
      console.error('No hay suficiente stock disponible');
      return false;
    }
    
    console.log('Añadiendo producto al carrito:', producto, 'cantidad:', cantidad);
    
    const itemExistente = this.carritoItems.find(item => item.id === producto.id);
    
    if (itemExistente) {
      // Check if we can add more of this product
      if (!this.productosService.checkStock(producto.id ?? 0, itemExistente.cantidad + cantidad)) {
        console.error('No hay suficiente stock disponible para la cantidad total');
        return false;
      }
      
      itemExistente.cantidad += cantidad;
      console.log('Producto ya existente, actualizando cantidad a:', itemExistente.cantidad);
    } else {
      this.carritoItems.push({ ...producto, cantidad });
      console.log('Nuevo producto añadido al carrito');
    }
    
this.actualizarCarrito();
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

  actualizarCantidad(id: number, cantidad: number): void {
    const item = this.carritoItems.find(item => item.id === id);
    if (item) {
      item.cantidad = cantidad;
      if (item.cantidad <= 0) {
        this.eliminarProducto(id);
      } else {
        this.actualizarCarrito();
      }
    }
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