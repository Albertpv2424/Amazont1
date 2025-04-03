import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProductoCategoria } from '../interfaces/producto-categoria.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  constructor() {
    this.initializeStock();
  }

  private initializeStock(): void {
    // Initialize stock for all products if not already set
    this.productos.forEach(producto => {
      if (producto.stock === undefined) {
        // Assign random stock between 5-30 units
        producto.stock = Math.floor(Math.random() * 25) + 5;
      }
    });
  }

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
      fechaLanzamiento: new Date('2024-01-15'),
      descuento: '10%',
      stock: 25,
      opiniones: [
        { usuario: 'Juan', comentario: 'Muy buen balón, perfecto para partidos y entrenamientos.', valoracion: 5 },
        { usuario: 'Ana', comentario: 'Excelente calidad y gran durabilidad.', valoracion: 4 },
        { usuario: 'Pedro', comentario: 'La calidad no es la esperada, se desgasta rápido.', valoracion: 2 }
      ]
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
      fechaLanzamiento: new Date('2023-11-20'),
      stock: 25,
      opiniones: [
        { usuario: 'Carlos', comentario: 'Gran raqueta, ofrece buen control en cada golpe.', valoracion: 5 },
        { usuario: 'Lucia', comentario: 'Muy cómoda y ligera, ideal para jugar a nivel profesional.', valoracion: 4 },
        { usuario: 'Miguel', comentario: 'El balance no es adecuado, me ha decepcionado un poco.', valoracion: 2 }
      ]
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
      fechaLanzamiento: new Date('2024-02-01'),
      stock: 25,
      opiniones: [
        { usuario: 'Sergio', comentario: 'Excelente bicicleta para terrenos difíciles.', valoracion: 5 },
        { usuario: 'Marta', comentario: 'Muy buena estabilidad y comodidad durante el trayecto.', valoracion: 4 },
        { usuario: 'Jorge', comentario: 'La cadena se oxida rápido y necesita mantenimiento frecuente.', valoracion: 2 }
      ]
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
      fechaLanzamiento: new Date('2023-09-15'),
      stock: 25,
      opiniones: [
        { usuario: 'Alba', comentario: 'Perfecto set para entrenamientos en casa, de muy buena calidad.', valoracion: 5 },
        { usuario: 'Diego', comentario: 'Buen set, con peso ajustable y fácil de manejar.', valoracion: 4 },
        { usuario: 'Raquel', comentario: 'El material se siente un poco barato, no cumple del todo.', valoracion: 2 }
      ]
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
      fechaLanzamiento: new Date('2024-01-30'),
      descuento: '15%',
      stock: 25,
      opiniones: [
        { usuario: 'Esther', comentario: 'Cómodas y ligeras, ideales para correr largas distancias.', valoracion: 5 },
        { usuario: 'Pablo', comentario: 'Excelente agarre y soporte durante el ejercicio.', valoracion: 4 },
        { usuario: 'Daniela', comentario: 'Se desgastan rápido y no son tan duraderas como esperaba.', valoracion: 2 }
      ]
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
      fechaLanzamiento: new Date('2024-02-10'),
      descuento: '20%',
      stock: 25,
      opiniones: [
        { usuario: 'Roberto', comentario: 'Potente y rápida, ideal para juegos exigentes.', valoracion: 5 },
        { usuario: 'Silvia', comentario: 'Excelente rendimiento gráfico y buena duración de batería.', valoracion: 4 },
        { usuario: 'Fernando', comentario: 'Calentamiento excesivo tras largas sesiones de juego.', valoracion: 2 }
      ]
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
      fechaLanzamiento: new Date('2024-01-20'),
      stock: 25,
      opiniones: [
        { usuario: 'Ana', comentario: 'Pantalla impresionante y cámara de alta resolución.', valoracion: 5 },
        { usuario: 'Miguel', comentario: 'Rendimiento muy fluido y buen diseño.', valoracion: 4 },
        { usuario: 'Laura', comentario: 'La batería dura poco y se queda sin carga rápidamente.', valoracion: 2 }
      ]
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
      fechaLanzamiento: new Date('2023-12-01'),
      stock: 25,
      opiniones: [
        { usuario: 'Javier', comentario: 'Sonido claro y cancelación de ruido efectiva.', valoracion: 5 },
        { usuario: 'Claudia', comentario: 'Cómodos y con excelente calidad de audio.', valoracion: 4 },
        { usuario: 'Sergio', comentario: 'La conectividad falla a veces y la batería se agota rápido.', valoracion: 2 }
      ]
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
      fechaLanzamiento: new Date('2023-11-15'),
      stock: 25,
      opiniones: [
        { usuario: 'Isabel', comentario: 'Muy práctico y con funciones útiles para la salud.', valoracion: 5 },
        { usuario: 'Andrés', comentario: 'Buena duración de batería y diseño moderno.', valoracion: 4 },
        { usuario: 'Carmen', comentario: 'La sincronización con el móvil presenta retrasos.', valoracion: 2 }
      ]
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
      fechaLanzamiento: new Date('2024-02-05'),
      descuento: '5%',
      stock: 25,
      opiniones: [
        { usuario: 'Vicente', comentario: 'Resolución de pantalla impresionante y diseño elegante.', valoracion: 5 },
        { usuario: 'Marina', comentario: 'Rendimiento excelente para multimedia y juegos.', valoracion: 4 },
        { usuario: 'Raul', comentario: 'Se queda corto en capacidad de almacenamiento para mis necesidades.', valoracion: 2 }
      ]
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
      fechaLanzamiento: new Date('2024-01-25'),
      stock: 25,
      opiniones: [
        { usuario: 'Teresa', comentario: 'Facilita mucho la preparación de comidas, muy versátil.', valoracion: 5 },
        { usuario: 'Gustavo', comentario: 'Muy eficiente y ahorra tiempo en la cocina.', valoracion: 4 },
        { usuario: 'Elena', comentario: 'Algunas funciones no son tan intuitivas como esperaba.', valoracion: 2 }
      ]
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
      fechaLanzamiento: new Date('2023-10-20'),
      stock: 25,
      opiniones: [
        { usuario: 'Marcos', comentario: 'Potente y con múltiples velocidades, ideal para batidos.', valoracion: 5 },
        { usuario: 'Sonia', comentario: 'Fácil de limpiar y con un diseño ergonómico.', valoracion: 4 },
        { usuario: 'Pablo', comentario: 'El motor se calienta demasiado rápido.', valoracion: 2 }
      ]
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
      fechaLanzamiento: new Date('2023-11-30'),
      descuento: '8%',
      stock: 25,
      opiniones: [
        { usuario: 'Marta', comentario: 'Cuchillos muy afilados y duraderos, excelentes para cocinar.', valoracion: 5 },
        { usuario: 'Luis', comentario: 'Buena calidad en el filo y manejo seguro.', valoracion: 4 },
        { usuario: 'Alberto', comentario: 'Algunos cuchillos pierden el filo con rapidez.', valoracion: 2 }
      ]
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
      fechaLanzamiento: new Date('2024-02-15'),
      stock: 25,
      opiniones: [
        { usuario: 'Daniela', comentario: 'El café sale perfecto, muy fácil de usar.', valoracion: 5 },
        { usuario: 'Jorge', comentario: 'Excelente sabor y rápida en calentar el agua.', valoracion: 4 },
        { usuario: 'Rosa', comentario: 'El mantenimiento es complicado y se ensucia con facilidad.', valoracion: 2 }
      ]
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
      fechaLanzamiento: new Date('2023-12-15'),
      stock: 25,
      opiniones: [
        { usuario: 'Claudio', comentario: 'Cocina uniformemente y tiene varias funciones útiles.', valoracion: 5 },
        { usuario: 'Marta', comentario: 'Muy práctico y con un diseño moderno.', valoracion: 4 },
        { usuario: 'Nuria', comentario: 'La puerta se calienta demasiado durante el uso.', valoracion: 2 }
      ]
    }
  ];

  // Add methods to manage stock
  
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
    
    const producto = this.productos.find(p => p.id === parseInt(id));
    return of(producto || null);
  }

  getOfertones(): ProductoCategoria[] {
    return this.productos.filter(producto => producto.descuento);
  }
}
