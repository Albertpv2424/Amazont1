import { Injectable } from '@angular/core';
import { ProductoCategoria } from '../interfaces/producto-categoria.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private productos: ProductoCategoria[] = [
    {
      id: 1,
      nombre: 'Balón de Fútbol',
      descripcion: 'Balón oficial de la Liga',
      precio: 29.99,
      imagen: 'assets/balon.png',
      categoria: 'Deportes'
    },
    {
      id: 2,
      nombre: 'Raqueta de Tenis',
      descripcion: 'Raqueta profesional',
      precio: 89.99,
      imagen: 'assets/raqueta.png',
      categoria: 'Deportes'
    },
    {
      id: 3,
      nombre: 'Laptop Gaming',
      descripcion: 'Laptop para gaming de última generación',
      precio: 999.99,
      imagen: 'assets/laptop.png',
      categoria: 'Tecnología'
    },
    {
      id: 4,
      nombre: 'Smartphone',
      descripcion: 'Último modelo con cámara profesional',
      precio: 799.99,
      imagen: 'assets/smartphone.png',
      categoria: 'Tecnología'
    },
    {
      id: 5,
      nombre: 'Batidora',
      descripcion: 'Batidora profesional de 5 velocidades',
      precio: 59.99,
      imagen: 'assets/batidora.png',
      categoria: 'Cocina'
    }
  ];

  getProductosPorCategoria(categoria: string): ProductoCategoria[] {
    return this.productos.filter(producto =>
      producto.categoria.toLowerCase() === categoria.toLowerCase()
    );
  }

  getAllProductos(): ProductoCategoria[] {
    return this.productos;
  }
}
