import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CarritoService, ProductoCarrito } from '../../services/carrito.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  productosCarrito: ProductoCarrito[] = [];
  subtotal: number = 0;
  envio: number = 0;
  total: number = 0;
  isDarkMode = false;

  constructor(
    private carritoService: CarritoService,
    private router: Router,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    console.log('Carrito component initialized');
    
    this.carritoService.getCarrito().subscribe(productos => {
      console.log('Productos en carrito recibidos:', productos);
      this.productosCarrito = productos;
      this.actualizarTotales();
    });

    this.themeService.darkMode$.subscribe(
      isDark => {
        this.isDarkMode = isDark;
        console.log('Dark mode updated in carrito:', isDark);
      }
    );
  }

  actualizarTotales(): void {
    this.subtotal = this.carritoService.obtenerTotal();
    this.envio = this.carritoService.calcularEnvio();
    this.total = this.subtotal + this.envio;
  }

  actualizarCantidad(producto: ProductoCarrito, event: any): void {
    if (producto.id) {
      const cantidad = typeof event === 'object' ? 
        parseInt(event.target?.value || '1', 10) : 
        parseInt(event || '1', 10);
      
      this.carritoService.actualizarCantidad(producto.id, cantidad);
    }
  }

  eliminarProducto(producto: ProductoCarrito): void {
    if (producto.id) {
      this.carritoService.eliminarProducto(producto.id);
    }
  }

  incrementarCantidad(producto: ProductoCarrito): void {
    if (producto.id) {
      this.carritoService.actualizarCantidad(producto.id, producto.cantidad + 1);
    }
  }

  decrementarCantidad(producto: ProductoCarrito): void {
    if (producto.id && producto.cantidad > 1) {
      this.carritoService.actualizarCantidad(producto.id, producto.cantidad - 1);
    }
  }

  vaciarCarrito(): void {
    console.log('Vaciando carrito desde el componente...');
    
    // Llamar al servicio para vaciar el carrito
    this.carritoService.vaciarCarrito();
    
    // Forzar actualización de la vista
    this.productosCarrito = [];
    this.actualizarTotales();
    
    console.log('Carrito vaciado, productos en la vista:', this.productosCarrito.length);
  }

  procederAlPago(): void {
    console.log('Iniciando proceso de pago...');
    
    // Guardar el total antes de vaciar el carrito
    const totalCompra = this.total;
    
    // Hacer una copia de los productos del carrito para reducir stock
    const productosParaReducirStock = [...this.productosCarrito];
    
    // Vaciar el carrito directamente en localStorage primero
    localStorage.removeItem('carrito');
    
    // Luego vaciar el carrito en el servicio
    this.carritoService.vaciarCarrito();
    
    // Forzar actualización de la vista inmediatamente
    this.productosCarrito = [];
    this.actualizarTotales();
    
    console.log('Carrito vaciado antes de procesar el pago');
    
    // Reducir stock para los productos (si es necesario)
    productosParaReducirStock.forEach(producto => {
      if (producto.id) {
        // Skip stock update since method doesn't exist in CarritoService
        console.log(`Stock update skipped for product ${producto.id}`);
      }
    });
    
    // Esperar un momento antes de navegar para asegurar que el carrito se ha vaciado
    setTimeout(() => {
      // Navegar a la página de confirmación
      this.router.navigate(['/confirmacion-compra'], { 
        queryParams: { 
          success: true,
          total: totalCompra
        } 
      });
    }, 100);
  }

  continuarComprando(): void {
    this.router.navigate(['/']);
  }
}
