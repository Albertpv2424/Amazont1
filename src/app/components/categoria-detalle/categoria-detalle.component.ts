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

      // Primer, obtenim totes les categories per trobar la id
      this.http.get<any>('http://localhost:8000/api/categorias').subscribe({
        next: (response) => {
          const categories = response.categorias || [];
          // CORRECCIÓ: Buscar per id_cat, no per id!
          const categoria = categories.find((cat: any) => cat.nombre.toLowerCase() === nombreCategoria.toLowerCase());
          if (categoria && categoria.id_cat) {
            const idCategoria = categoria.id_cat; // <-- Aquí el canvi important
            console.log('ID de la categoria trobada:', idCategoria);

            // Ara sí, fem la petició pel detall de la categoria o productes
            this.http.get<any>(`http://localhost:8000/api/categorias/${idCategoria}`).subscribe({
              next: (resp) => {
                this.productos = resp.productos || [];
                console.log('Productes carregats des de l\'API:', this.productos);
              },
              error: (err) => {
                console.error('Error carregant productes des de l\'API:', err);
                this.productos = [];
              }
            });
          } else {
            console.error('No s\'ha trobat la categoria amb aquest nom!');
            this.productos = [];
          }
        },
        error: (err) => {
          console.error('Error carregant categories des de l\'API:', err);
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

  anadirAlCarrito(producto: ProductoCategoria): void {
    // Añadir el producto al carrito con cantidad 1
    const resultado = this.carritoService.agregarProducto(producto, 1);
    if (resultado) {
      console.log('Producto añadido al carrito:', producto.nombre);
      // Aquí puedes mostrar una notificación si lo deseas
    } else {
      console.error('No se pudo añadir el producto al carrito');
      // Aquí puedes mostrar un mensaje de error si lo deseas
    }
  }

  navegarAProducto(producto: ProductoCategoria) {
    if (producto && producto.id) {
      this.router.navigate(['/producto', producto.id]);
    }
  }
}