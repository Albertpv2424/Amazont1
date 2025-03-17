import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductosService } from '../../services/productos.service';
import { ProductoComponent } from '../producto/producto.component';
import { ProductoCategoria } from '../../interfaces/producto-categoria.interface';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-busqueda',
  standalone: true,
  imports: [CommonModule, ProductoComponent],
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaComponent implements OnInit {
  searchTerm: string = '';
  resultados: ProductoCategoria[] = [];
  isDarkMode = false;

  constructor(
    private route: ActivatedRoute,
    private productosService: ProductosService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['q'] || '';
      this.buscarProductos();
    });

    this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
  }

  buscarProductos(): void {
    if (this.searchTerm) {
      const allProductos = this.productosService.getAllProductos();
      this.resultados = allProductos.filter(producto => 
        producto.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        producto.categoria.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.resultados = [];
    }
  }
}
