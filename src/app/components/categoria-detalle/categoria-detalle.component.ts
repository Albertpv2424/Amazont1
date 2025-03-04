import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { ProductoCategoria } from '../../interfaces/producto-categoria.interface';
import { ThemeService } from '../../services/theme.service';

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
    private productosService: ProductosService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.nombreCategoria = params['nombre'];
      this.productos = this.productosService.getProductosPorCategoria(this.nombreCategoria);
      console.log('Productos cargados:', this.productos); // Para depuración
    });

    this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
  }

  get productosFiltrados() {
    return this.productos
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
  }
  anadirAlCarrito(producto: ProductoCategoria) {
    // Lógica para añadir el producto al carrito
    console.log('Producto añadido al carrito:', producto);
  }
}