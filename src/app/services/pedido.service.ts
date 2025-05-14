import { Injectable } from '@angular/core';
import { Pedido } from '../models/pedido.model';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private pedidos: Pedido[] = [];

  constructor(private authService: AuthService) {
    this.cargarPedidos();
  }

  private cargarPedidos(): void {
    // Obtener el usuario actual
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.pedidos = [];
      return;
    }
    
    // Usar una clave específica para cada usuario
    const userKey = `pedidos_${currentUser.email}`;
    const pedidosGuardados = localStorage.getItem(userKey);
    
    if (pedidosGuardados) {
      try {
        this.pedidos = JSON.parse(pedidosGuardados);
        console.log('Pedidos cargados desde localStorage:', this.pedidos);
      } catch (error) {
        console.error('Error al parsear pedidos:', error);
        this.pedidos = [];
      }
    } else {
      this.pedidos = [];
    }
  }

  private guardarEnLocalStorage(): void {
    // Obtener el usuario actual
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;
    
    // Usar una clave específica para cada usuario
    const userKey = `pedidos_${currentUser.email}`;
    localStorage.setItem(userKey, JSON.stringify(this.pedidos));
  }

  getPedidos(): Pedido[] {
    // Recargar los pedidos desde localStorage por si han cambiado
    this.cargarPedidos();
    return this.pedidos;
  }

  getPedidoPorId(id: number): Pedido | undefined {
    return this.pedidos.find(p => p.id === id);
  }

  guardarPedido(pedido: Pedido): void {
    // Verificar si ya existe un pedido con el mismo ID
    const index = this.pedidos.findIndex(p => p.id === pedido.id);
    
    if (index !== -1) {
      // Actualizar el pedido existente
      this.pedidos[index] = pedido;
    } else {
      // Añadir el nuevo pedido
      this.pedidos.push(pedido);
    }
    
    // Guardar en localStorage
    this.guardarEnLocalStorage();
    console.log('Pedidos actualizados:', this.pedidos);
  }

  eliminarPedido(id: number): void {
    this.pedidos = this.pedidos.filter(p => p.id !== id);
    this.guardarEnLocalStorage();
  }
}