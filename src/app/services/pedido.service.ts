import { Injectable } from '@angular/core';
import { Pedido } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private readonly PEDIDOS_KEY = 'pedidos';

  constructor() { }

  // Obtener todos los pedidos del localStorage
  getPedidos(): Pedido[] {
    const pedidosString = localStorage.getItem(this.PEDIDOS_KEY);
    return pedidosString ? JSON.parse(pedidosString) : [];
  }

  // Guardar un nuevo pedido
  guardarPedido(pedido: Pedido): Pedido {
    const pedidos = this.getPedidos();
    
    // Generar un ID único (puedes usar una lógica más robusta si es necesario)
    pedido.id = this.generarId(pedidos);
    
    // Establecer la fecha actual si no se proporciona
    if (!pedido.fecha) {
      pedido.fecha = new Date().toISOString().split('T')[0];
    }
    
    // Añadir el nuevo pedido a la lista
    pedidos.push(pedido);
    
    // Guardar la lista actualizada en localStorage
    localStorage.setItem(this.PEDIDOS_KEY, JSON.stringify(pedidos));
    
    return pedido;
  }

  // Obtener un pedido específico por ID
  getPedidoPorId(id: number): Pedido | undefined {
    const pedidos = this.getPedidos();
    return pedidos.find(p => p.id === id);
  }

  // Actualizar un pedido existente
  actualizarPedido(pedido: Pedido): boolean {
    const pedidos = this.getPedidos();
    const index = pedidos.findIndex(p => p.id === pedido.id);
    
    if (index !== -1) {
      pedidos[index] = pedido;
      localStorage.setItem(this.PEDIDOS_KEY, JSON.stringify(pedidos));
      return true;
    }
    
    return false;
  }

  // Eliminar un pedido
  eliminarPedido(id: number): boolean {
    const pedidos = this.getPedidos();
    const nuevaLista = pedidos.filter(p => p.id !== id);
    
    if (nuevaLista.length !== pedidos.length) {
      localStorage.setItem(this.PEDIDOS_KEY, JSON.stringify(nuevaLista));
      return true;
    }
    
    return false;
  }

  // Generar un ID único para el nuevo pedido
  private generarId(pedidos: Pedido[]): number {
    if (pedidos.length === 0) {
      return 1;
    }
    
    // Encontrar el ID más alto y añadir 1
    const maxId = Math.max(...pedidos.map(p => p.id));
    return maxId + 1;
  }
}