import { Injectable } from '@angular/core';
import { ProductoCategoria } from '../interfaces/producto-categoria.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private productos: ProductoCategoria[] = [
    // Deportes
    {
      id: 1,
      nombre: 'Balón de Fútbol Profesional',
      descripcion: 'Balón oficial de la Liga, diseño 2024',
      precio: 29.99,
      imagen: 'assets/balon.png',
      categoria: 'Deportes',
      popularidad: 4.5,
      esNuevo: true,
      envioGratis: true,
      fechaLanzamiento: new Date('2024-01-15')
    },
    {
      id: 2,
      nombre: 'Raqueta de Tenis Pro',
      descripcion: 'Raqueta profesional de grafito',
      precio: 189.99,
      imagen: 'assets/raqueta.png',
      categoria: 'Deportes',
      popularidad: 4.2,
      esNuevo: false,
      envioGratis: true,
      fechaLanzamiento: new Date('2023-11-20')
    },
    {
      id: 3,
      nombre: 'Bicicleta de Montaña',
      descripcion: 'Bicicleta todo terreno con 21 velocidades',
      precio: 499.99,
      imagen: 'assets/bicicleta.jpg',
      categoria: 'Deportes',
      popularidad: 4.8,
      esNuevo: true,
      envioGratis: true,
      fechaLanzamiento: new Date('2024-02-01')
    },
    {
      id: 4,
      nombre: 'Set de Pesas',
      descripcion: 'Set completo de pesas ajustables',
      precio: 299.99,
      imagen: 'assets/pesas.png',
      categoria: 'Deportes',
      popularidad: 4.3,
      esNuevo: false,
      envioGratis: true,
      fechaLanzamiento: new Date('2023-09-15')
    },
    {
      id: 5,
      nombre: 'Zapatillas Running',
      descripcion: 'Zapatillas profesionales para correr',
      precio: 89.99,
      imagen: 'assets/zapatillas.png',
      categoria: 'Deportes',
      popularidad: 4.6,
      esNuevo: true,
      envioGratis: true,
      fechaLanzamiento: new Date('2024-01-30')
    },

    // Tecnología
    {
      id: 6,
      nombre: 'Laptop Gaming Pro',
      descripcion: 'Laptop gaming con RTX 4080',
      precio: 1499.99,
      imagen: 'assets/laptop.png',
      categoria: 'Tecnología',
      popularidad: 4.9,
      esNuevo: true,
      envioGratis: true,
      fechaLanzamiento: new Date('2024-02-10')
    },
    {
      id: 7,
      nombre: 'Smartphone Ultimate',
      descripcion: 'Último modelo con cámara 108MP',
      precio: 899.99,
      imagen: 'assets/smartphone.png',
      categoria: 'Tecnología',
      popularidad: 4.7,
      esNuevo: true,
      envioGratis: true,
      fechaLanzamiento: new Date('2024-01-20')
    },
    {
      id: 8,
      nombre: 'Auriculares Bluetooth',
      descripcion: 'Auriculares inalámbricos con cancelación de ruido',
      precio: 199.99,
      imagen: 'assets/auriculares.png',
      categoria: 'Tecnología',
      popularidad: 4.4,
      esNuevo: false,
      envioGratis: true,
      fechaLanzamiento: new Date('2023-12-01')
    },
    {
      id: 9,
      nombre: 'Smartwatch Pro',
      descripcion: 'Reloj inteligente con GPS y monitor cardíaco',
      precio: 299.99,
      imagen: 'assets/smartwatch.png',
      categoria: 'Tecnología',
      popularidad: 4.3,
      esNuevo: false,
      envioGratis: true,
      fechaLanzamiento: new Date('2023-11-15')
    },
    {
      id: 10,
      nombre: 'Tablet 4K',
      descripcion: 'Tablet de 12" con pantalla 4K',
      precio: 699.99,
      imagen: 'assets/tablet.png',
      categoria: 'Tecnología',
      popularidad: 4.6,
      esNuevo: true,
      envioGratis: true,
      fechaLanzamiento: new Date('2024-02-05')
    },

    // Cocina
    {
      id: 11,
      nombre: 'Robot de Cocina',
      descripcion: 'Robot de cocina multifunción',
      precio: 599.99,
      imagen: 'assets/robot-cocina.jpg',
      categoria: 'Cocina',
      popularidad: 4.8,
      esNuevo: true,
      envioGratis: true,
      fechaLanzamiento: new Date('2024-01-25')
    },
    {
      id: 12,
      nombre: 'Batidora Profesional',
      descripcion: 'Batidora de vaso con 10 velocidades',
      precio: 159.99,
      imagen: 'assets/batidora.png',
      categoria: 'Cocina',
      popularidad: 4.2,
      esNuevo: false,
      envioGratis: true,
      fechaLanzamiento: new Date('2023-10-20')
    },
    {
      id: 13,
      nombre: 'Set de Cuchillos',
      descripcion: 'Set profesional de cuchillos de cocina',
      precio: 199.99,
      imagen: 'assets/cuchillos.png',
      categoria: 'Cocina',
      popularidad: 4.5,
      esNuevo: false,
      envioGratis: true,
      fechaLanzamiento: new Date('2023-11-30')
    },
    {
      id: 14,
      nombre: 'Cafetera Espresso',
      descripcion: 'Cafetera automática con molinillo',
      precio: 399.99,
      imagen: 'assets/cafetera.png',
      categoria: 'Cocina',
      popularidad: 4.7,
      esNuevo: true,
      envioGratis: true,
      fechaLanzamiento: new Date('2024-02-15')
    },
    {
      id: 15,
      nombre: 'Horno Eléctrico',
      descripcion: 'Horno eléctrico de convección',
      precio: 299.99,
      imagen: 'assets/horno.png',
      categoria: 'Cocina',
      popularidad: 4.4,
      esNuevo: false,
      envioGratis: true,
      fechaLanzamiento: new Date('2023-12-15')
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
