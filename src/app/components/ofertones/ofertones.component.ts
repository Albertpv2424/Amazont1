import { Component, OnInit } from '@angular/core';
import { Producto } from '../../interfaces/producto.interface';
import { ProductoComponent } from '../producto/producto.component';
import { CommonModule } from '@angular/common';
import { ProductosService } from '../../services/productos.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-ofertones',
  standalone: true,
  templateUrl: './ofertones.component.html',
  styleUrls: ['./ofertones.component.css'],
  imports: [CommonModule, ProductoComponent] 
})
export class OfertonesComponent implements OnInit {
  ofertas: Producto[] = [];
  isDarkMode = false;
  currentIndex: number = 0;

  constructor(
    private productosService: ProductosService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    // Obtener productos con descuento del servicio
    this.ofertas = this.productosService.getOfertones();
    console.log('Ofertas cargadas:', this.ofertas);

    this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.ofertas.length; 
  }

  previous() {
    this.currentIndex = (this.currentIndex - 1 + this.ofertas.length) % this.ofertas.length; 
  }

  get visibleOffers() {
    if (this.ofertas.length === 0) return [];
    return [
      this.ofertas[this.currentIndex],
      this.ofertas[(this.currentIndex + 1) % this.ofertas.length],
      this.ofertas[(this.currentIndex + 2) % this.ofertas.length],
      this.ofertas[(this.currentIndex + 3) % this.ofertas.length]
    ].filter(oferta => oferta !== undefined);
  }
}
