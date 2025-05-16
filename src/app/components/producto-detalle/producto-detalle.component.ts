import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { CarritoService } from '../../services/carrito.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producto-detalle.component.html',
  styleUrls: ['./producto-detalle.component.css']
})
export class ProductoDetalleComponent implements OnInit {
  producto: any = {};
  isDarkMode = false;
  categoriaActual: string | null = null;
  cantidad: number = 1;
  mostrarPopup: boolean = false;
  reviews: any[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private productosService: ProductosService,
    private themeService: ThemeService,
    private carritoService: CarritoService,
    private http: HttpClient
  ) {}
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    this.productosService.getProductoById(id).subscribe(data => {
      console.log('Dades rebudes del servei:', data); // Afegit per depuració
      if (data && Object.keys(data).length > 0) {
        this.producto = data;
        console.log('Producto cargado:', this.producto);
        
        // Carregar les ressenyes del producte
        this.cargarResenas(this.producto.id_prod || this.producto.id);
      } else {
        console.error('Producto no encontrado con ID:', id);
      }
    }, error => {
      console.error('Error al carregar el producte:', error);
    });
    
    this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
  }

  cargarResenas(productId: number): void {
    // Obtener el token de autenticación
    const token = localStorage.getItem('auth_token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  
    // Hacer la petición con los headers de autenticación
    this.http.get(`http://127.0.0.1:8000/api/reviews/${productId}`, { headers }).subscribe({
      next: (response: any) => {
        console.log('Reseñas cargadas:', response);
        // Afegim més console.logs per depurar
        console.log('Estructura de la resposta:', JSON.stringify(response));
        console.log('Reviews array:', response.reviews);
        
        // Actualitzem per utilitzar response.reviews en lloc de response.data
        this.reviews = response.reviews || [];
        console.log('Reviews assignades:', this.reviews);
      },
      error: (error) => {
        console.error('Error al cargar las reseñas:', error);
      }
    });
  }

  anadirAlCarrito() {
    console.log('Producto seleccionado:', this.producto); // Añadido para depuración
    console.log('Producto ID:', this.producto.id_prod); // Añadido para depuración
    const id = this.producto.id_prod || this.producto.id;
    
    if (id) { 
      this.carritoService.addToCart(Number(id), this.cantidad).subscribe({
        next: () => {
          console.log('Producto añadido correctamente');
          this.carritoService.obtenerCantidadTotal();
          this.mostrarPopup = true; // Mostrar confirmación
          setTimeout(() => {
            this.mostrarPopup = false;
          }, 2000); // Ocultar después de 2 segundos
        },
        error: (error) => {
          console.error('Error detallado:', error.error?.errors || error);
          // Redirigir a login si no está autenticado
          if (error.status === 401) {
            // Aquí necesitarías inyectar el Router en el constructor
            // this.router.navigate(['/login']);
          }
        }
      });
    } else {
      console.error('Producto sin ID:', this.producto);
    }
  }
  
  incrementarCantidad() {
    // Verificar si ya alcanzó el stock máximo
    if (this.cantidad < this.producto.stock) {
      this.cantidad++;
    } else {
      this.mostrarPopup = true; // Now this property is defined
    }
  }

  decrementarCantidad() {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }
  
  cerrarPopup() {
    this.mostrarPopup = false;
  }
}