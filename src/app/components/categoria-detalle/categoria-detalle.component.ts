import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../services/productos.service';
import { ProductoCategoria } from '../../interfaces/producto-categoria.interface';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-categoria-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categoria-detalle.component.html',
  styleUrls: ['./categoria-detalle.component.css']
})
export class CategoriaDetalleComponent implements OnInit {
  nombreCategoria: string = '';
  precioMinimo: number = 0;
  precioMaximo: number = 1000;
  ordenar: string = 'precio-asc';
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
    });

    this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
  }

  get productosFiltrados() {
    return this.productos
      .filter(p => p.precio >= this.precioMinimo && p.precio <= this.precioMaximo)
      .sort((a, b) => {
        if (this.ordenar === 'precio-asc') return a.precio - b.precio;
        if (this.ordenar === 'precio-desc') return b.precio - a.precio;
        return 0;
      });
  }
}
