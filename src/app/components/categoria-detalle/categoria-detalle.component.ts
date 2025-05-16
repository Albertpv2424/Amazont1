import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { ProductoCategoria } from '../../interfaces/producto-categoria.interface';
import { ThemeService } from '../../services/theme.service';
import { CarritoService } from '../../services/carrito.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-categoria-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './categoria-detalle.component.html',
  styleUrls: ['./categoria-detalle.component.css']
})
export class CategoriaDetalleComponent implements OnInit {
  nombreCategoria: string = '';
  precioMinimo: number = 0;
  precioMaximo: number = 100000;
  ordenar: string = 'precio-asc';
  filtroPopularidad: string = 'todos';
  filtroNovedad: boolean = false;
  filtroEnvioGratis: boolean = false;
  productos: ProductoCategoria[] = [];
  isDarkMode = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productosService: ProductosService,
    private themeService: ThemeService,
    private carritoService: CarritoService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const nombreCategoria = params['nombre'];
      this.nombreCategoria = nombreCategoria;
      console.log('Nom de la categoria:', nombreCategoria);
  
      // Hacer la petición directa a la API usando el nombre de la categoría
      this.http.get<any>(`http://localhost:8000/api/categorias/nombre/${nombreCategoria}`).subscribe({
        next: (response) => {
          console.log('Resposta detall categoria:', response);
          if ((response.status === "exito" || response.status === "éxito") && response.categoria) {
            // Extraer la información de la categoría
            const categoria = response.categoria;
            
            // Guardar los productos de la categoría
            this.productos = categoria.productos || [];
            console.log('Productos cargados desde la API:', this.productos);
            
            // Añadir este log para verificar la estructura exacta de cada producto
            if (this.productos.length > 0) {
              console.log('Estructura del primer producto:', JSON.stringify(this.productos[0]));
            }
          } else {
            console.error('Respuesta de API incorrecta:', response);
            this.productos = [];
          }
        },
        error: (err) => {
          console.error('Error cargando productos desde la API:', err);
          this.productos = [];
        }
      });
    });

    this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
  }

  getProductosPorCategoria(nombreCategoria: string): ProductoCategoria[] {
    return this.productos.filter(p => p.categoria === nombreCategoria);
  }

  get productosFiltrados() {
    const filtrats = this.productos
      .filter(p => {
        // Filtro por precio
        const cumplePrecio = p.precio >= this.precioMinimo && p.precio <= this.precioMaximo;

        // Filtro por popularidad
        const cumplePopularidad =
          this.filtroPopularidad === 'todos' ? true :
          this.filtroPopularidad === 'populares' ? p.popularidad >= 4.5 :
          this.filtroPopularidad === 'nuevos' ? p.esNuevo : true;

        // Filtro por envío gratis
        const cumpleEnvioGratis = this.filtroEnvioGratis ? p.envioGratis : true;

        return cumplePrecio && cumplePopularidad && cumpleEnvioGratis;
      })
      .sort((a, b) => {
        if (this.ordenar === 'precio-asc') {
          return a.precio - b.precio;
        } else if (this.ordenar === 'precio-desc') {
          return b.precio - a.precio;
        }
        return 0;
      });
    console.log('Productes filtrats:', filtrats);
    return filtrats;
  }

  anadirAlCarrito(producto: ProductoCategoria) {
    console.log('Producte seleccionat:', producto); // Afegit per depuració
    console.log('Producte ID:', producto.id_prod); // Afegit per depuració
    const no = producto.id_prod;
    if (producto) { 
      this.carritoService.addToCart(Number(no), 1).subscribe({
        next: () => {
          console.log('Producte afegit correctament');
          this.carritoService.obtenerCantidadTotal();
        },
        error: (error) => {
          console.error('Error detallat:', error.error.errors);
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
        }
      });
    } else {
      console.error('Producte sense ID:', producto);
    }
  }

  navegarAProducto(producto: ProductoCategoria) {
    console.log('Navegant a producte:', producto); // Afegit per depuració
    console.log('ID del producte:', producto.id_prod); // Afegit per depuració
    if (producto && producto.id_prod) {
      this.router.navigate(['/producto', producto.id_prod]);
    } else {
      console.error('Producte sense ID:', producto);
    }
  }
}