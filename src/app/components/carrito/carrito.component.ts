// Importaciones necesarias para el funcionamiento del componente
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CarritoService, ProductoCarrito } from '../../services/carrito.service';
import { ThemeService } from '../../services/theme.service';
import { ProductosService } from '../../services/productos.service';
import { AuthService } from '../../services/auth.service'; // Añadir esta importación

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  // Propiedades para almacenar los productos en el carrito y calcular totales
  productosCarrito: ProductoCarrito[] = [];
  subtotal: number = 0;
  envio: number = 0;
  total: number = 0;
  isDarkMode = false;
  // Propiedades para el popup de stock máximo
  mostrarPopupStockMaximo = false;
  productoLimiteStock: ProductoCarrito | null = null;
  
  // Añadir nueva propiedad para el popup de login
  mostrarPopupLogin = false;

  constructor(
    private carritoService: CarritoService,
    private router: Router,
    private themeService: ThemeService,
    private productosService: ProductosService,
    private authService: AuthService // Añadir el servicio de autenticación
  ) {}

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    console.log('Carrito component initialized');
    
    // Suscripción a los cambios en el carrito
    this.carritoService.getCarrito().subscribe(productos => {
      console.log('Productos en carrito recibidos:', productos);
      this.productosCarrito = productos;
      this.actualizarTotales();
    });

    // Suscripción al tema oscuro/claro
    this.themeService.darkMode$.subscribe(
      isDark => {
        this.isDarkMode = isDark;
        console.log('Dark mode updated in carrito:', isDark);
      }
    );
  }

  // Método para actualizar los totales del carrito
  actualizarTotales(): void {
    this.subtotal = this.carritoService.obtenerTotal();
    this.envio = this.carritoService.calcularEnvio();
    this.total = this.subtotal + this.envio;
  }

// Mètode per actualitzar la quantitat d'un producte al carret
actualizarCantidad(producto: ProductoCarrito, event: any): void {
  
  // Comprovem que el producte tingui un id vàlid
  if (producto.id) {
    
    // Obtenim la quantitat depenent del tipus 
    const cantidad = typeof event === 'object' ? 
      parseInt(event.target?.value || '1', 10) : 
      parseInt(event || '1', 10);

    // Truquem al servei del carret per actualitzar la quantitat del producte amb l'id i la nova quantitat
    this.carritoService.actualizarCantidad(producto.id, cantidad);
  }
}

  // Método para eliminar un producto del carrito
  eliminarProducto(producto: ProductoCarrito): void {
    if (producto.id) {
      this.carritoService.eliminarProducto(producto.id);
    }
  }

  // Método para incrementar la cantidad de un producto
  incrementarCantidad(producto: ProductoCarrito): void {
    if (producto.id) {
      // Verificar si ya alcanzó el stock máximo
      const stockDisponible = this.productosService.getStock(producto.id);
      if (producto.cantidad >= stockDisponible) {
        // Mostrar popup de stock máximo
        this.productoLimiteStock = producto;
        this.mostrarPopupStockMaximo = true;
        return;
      }
      this.carritoService.actualizarCantidad(producto.id, producto.cantidad + 1);
    }
  }
    // Método para decrementar la cantidad de un producto
    decrementarCantidad(producto: ProductoCarrito): void {
      if (producto.id && producto.cantidad > 1) {
        this.carritoService.actualizarCantidad(producto.id, producto.cantidad - 1);
      }
    }

  // Método para cerrar el popup de stock máximo
  cerrarPopupStockMaximo(): void {
    this.mostrarPopupStockMaximo = false;
    this.productoLimiteStock = null;
  }



  // Método para vaciar completamente el carrito
  vaciarCarrito(): void {
    console.log('Vaciando carrito desde el componente...');
    
    // Llamar al servicio para vaciar el carrito
    this.carritoService.vaciarCarrito();
    
    // Forzar actualización de la vista
    this.productosCarrito = [];
    this.actualizarTotales();
    
    console.log('Carrito vaciado, productos en la vista:', this.productosCarrito.length);
  }

  // Método para proceder al pago
  procederAlPago(): void {
    // Verificar si el usuario está logueado
    if (!this.authService.isLoggedIn()) {
      // Mostrar popup de login
      this.mostrarPopupLogin = true;
      return;
    }
    
    console.log('Iniciando proceso de pago...');
    
    // Navegar al proceso de pago
    this.router.navigate(['/proceso-pago']);
    
    // Importante: Detener la ejecución aquí para que no se vacíe el carrito
    return;
    
    // El código siguiente se ejecutará en el componente de proceso de pago
    // después de completar la compra, no aquí
  


  // Guardar el total antes de vaciar el carrito
    const totalCompra = this.total;
    
    // Hacer una copia de los productos para reducir stock
    const productosParaReducirStock = [...this.productosCarrito];
    
    // Vaciar el carrito en localStorage y en el servicio
// Remove cart data from local storage
    this.carritoService.vaciarCarrito();
    
    // Actualizar la vista
    this.productosCarrito = [];
    this.actualizarTotales();
    
    // Navegar a la página de confirmación después de un breve retraso
    setTimeout(() => {
      this.router.navigate(['/confirmacion-compra'], { 
        queryParams: { 
          success: true,
          total: totalCompra
        } 
      });
    }, 100);
  }

  // Método para cerrar el popup de login
  cerrarPopupLogin(): void {
    this.mostrarPopupLogin = false;
  }
  
  // Método para ir a la página de login
  irALogin(): void {
    this.router.navigate(['/login']);
  }

  // Método para continuar comprando (volver a la página principal)
  continuarComprando(): void {
    this.router.navigate(['/']);
  }
}
