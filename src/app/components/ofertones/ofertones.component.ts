import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { ProductoCategoria } from '../../interfaces/producto-categoria.interface';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';
import { ProductoComponent } from '../producto/producto.component'; // Add this import

@Component({
  selector: 'app-ofertones',
  templateUrl: './ofertones.component.html',
  styleUrls: ['./ofertones.component.css'],
  standalone: true,
  imports: [CommonModule, ProductoComponent] // Add ProductoComponent here
})
export class OfertonesComponent implements OnInit {
  productos: ProductoCategoria[] = [];
  ofertas: ProductoCategoria[] = []; // Add this property
  visibleOffers: ProductoCategoria[] = [];
  currentIndex = 0;
  itemsPerPage = 3;
  isDarkMode = false;
  
  constructor(
    private productosService: ProductosService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.productos = this.productosService.getAllProductos();
    console.log('Productes carregats:', this.productos); // Afegir aquesta línia
    this.ofertas = this.productos.filter(p => p.oferta); // Filtrar productes amb ofertes
    this.updateVisibleOffers();

    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
}

  updateVisibleOffers(): void {
    this.visibleOffers = this.ofertas.slice(this.currentIndex, this.currentIndex + this.itemsPerPage);
  }

  next(): void {
    if (this.currentIndex + this.itemsPerPage < this.ofertas.length) {
      this.currentIndex += this.itemsPerPage;
      this.updateVisibleOffers();
    }
  }

  previous(): void {
    if (this.currentIndex - this.itemsPerPage >= 0) {
      this.currentIndex -= this.itemsPerPage;
      this.updateVisibleOffers();
    }
  }
}
