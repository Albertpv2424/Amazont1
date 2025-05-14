// Importacions necessàries per al funcionament del component
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CarritoService, ProductoCarrito } from '../../services/carrito.service';
import { ThemeService } from '../../services/theme.service';
import { ProductosService } from '../../services/productos.service';
import { AuthService } from '../../services/auth.service';
import { PedidoService } from '../../services/pedido.service';
import { Pedido } from '../../models/pedido.model';
import { HttpClient } from '@angular/common/http';

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
  mostrarPopupStockMaximo = false;
  productoLimiteStock: ProductoCarrito | null = null;
  mostrarPopupLogin = false;

  constructor(
    private carritoService: CarritoService,
    private router: Router,
    private themeService: ThemeService,
    private productosService: ProductosService,
    private authService: AuthService,
    private pedidoService: PedidoService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    console.log('Carrito component initialized');
    this.themeService.darkMode$.subscribe(
      isDark => {
        this.isDarkMode = isDark;
        console.log('Dark mode updated in carrito:', isDark);
      }
    );

    if (this.authService.isLoggedIn()) {
      const token = localStorage.getItem('auth_token');
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      this.http.get('http://localhost:8000/api/cart', { headers }).subscribe({
        next: (response: any) => {
          console.log('API Response:', response);
          if (response?.status === 'success' && response.cart) {
            // Comprova si cart.items és un array
            const items = Array.isArray(response.cart.items) ? response.cart.items : [];
            this.productosCarrito = items.map((item: any) => ({
              id: item.id,
              nombre: item.nombre || 'Producto desconocido',
              precio: item.precio || 0,
              cantidad: item.cantidad || 1,
              imagen: item.imagen ? 'assets/' + item.imagen : 'assets/default.png',
              envioGratis: item.envio_gratis || false
            }));
            console.log('Productos cargados:', this.productosCarrito);
          } else {
            console.error('Respuesta del API no válida');
            this.productosCarrito = [];
          }
          this.actualizarTotales();
        },
        error: (error) => {
          console.error('Error al obtener el carrito:', error);
          this.productosCarrito = [];
          this.actualizarTotales();
        }
      });
    } else {
      // Carregar carret des de localStorage si no està autenticat
      const carritoGuardado = localStorage.getItem('carrito');
      if (carritoGuardado) {
        try {
          this.productosCarrito = JSON.parse(carritoGuardado);
          console.log('Carrito cargado desde localStorage:', this.productosCarrito);
        } catch (e) {
          console.error('Error parsing cart from localStorage:', e);
          this.productosCarrito = [];
        }
      } else {
        this.productosCarrito = [];
      }
      this.actualizarTotales();
    }
  }

  actualizarTotales(): void {
    this.subtotal = this.carritoService.obtenerTotal();
    this.envio = this.carritoService.calcularEnvio();
    this.total = this.subtotal + this.envio;
  }

  actualizarCantidad(producto: ProductoCarrito, event: any): void {
    if (producto.id) {
      const cantidad = typeof event === 'object'
        ? parseInt(event.target?.value || '1', 10)
        : parseInt(event || '1', 10);
      this.carritoService.actualizarCantidad(producto.id, cantidad);
      this.actualizarTotales();
    }
  }

  eliminarProducto(producto: ProductoCarrito): void {
    if (producto.id) {
      this.carritoService.eliminarProducto(producto.id);
      this.actualizarTotales();
    }
  }

  incrementarCantidad(producto: ProductoCarrito): void {
    if (producto.id) {
      const stockDisponible = this.productosService.getStock(producto.id);
      if (producto.cantidad >= stockDisponible) {
        this.productoLimiteStock = producto;
        this.mostrarPopupStockMaximo = true;
        return;
      }
      this.carritoService.actualizarCantidad(producto.id, producto.cantidad + 1);
      this.actualizarTotales();
    }
  }

  decrementarCantidad(producto: ProductoCarrito): void {
    if (producto.id && producto.cantidad > 1) {
      this.carritoService.actualizarCantidad(producto.id, producto.cantidad - 1);
      this.actualizarTotales();
    }
  }

  cerrarPopupStockMaximo(): void {
    this.mostrarPopupStockMaximo = false;
    this.productoLimiteStock = null;
  }

  vaciarCarrito(): void {
    console.log('Vaciando carrito desde el componente...');
    this.carritoService.vaciarCarrito();
    this.productosCarrito = [];
    this.actualizarTotales();
    console.log('Carrito vaciado, productos en la vista:', this.productosCarrito.length);
  }

  procederAlPago(): void {
    if (!this.authService.isLoggedIn()) {
      this.mostrarPopupLogin = true;
      return;
    }
    console.log('Iniciando proceso de pago...');
    this.router.navigate(['/proceso-pago']);
  }

  cerrarPopupLogin(): void {
    this.mostrarPopupLogin = false;
  }

  irALogin(): void {
    this.router.navigate(['/login']);
  }

  continuarComprando(): void {
    this.router.navigate(['/']);
  }

  finalizarCompra(): void {
    if (!this.authService.isLoggedIn()) {
      this.mostrarPopupLogin = true;
      return;
    }
    const nuevoPedido: Pedido = {
      id: 0,
      fecha: new Date().toISOString().split('T')[0],
      total: this.total,
      estado: 'Pendiente',
      productos: this.productosCarrito,
    };
    this.pedidoService.guardarPedido(nuevoPedido);
    this.carritoService.vaciarCarrito();
    this.productosCarrito = [];
    this.actualizarTotales();
    this.router.navigate(['/confirmacion-compra'], {
      queryParams: {
        success: true,
        total: this.total
      }
    });
  }
}
