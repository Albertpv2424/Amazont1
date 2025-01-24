import { Component } from '@angular/core';
import { Producto } from '../../interfaces/producto.interface';
import { ProductoComponent } from '../producto/producto.component';
import { CommonModule } from '@angular/common'; 


@Component({
  selector: 'app-ofertones',
  standalone: true,
  templateUrl: './ofertones.component.html',
  styleUrls: ['./ofertones.component.css'],
  imports: [CommonModule, ProductoComponent] 
})
export class OfertonesComponent {
  ofertas: Producto[] = [
    { imagen: 'assets/fifa25.png', titulo: 'Oferta Flash', descuento: '-46%' },
    { imagen: 'assets/panales.png', titulo: 'Oferta Flash', descuento: '-29%' },
    { imagen: 'assets/scalextric.png', titulo: 'Oferta Flash', descuento: '-20%' },
    { imagen: 'assets/nba2k25.png', titulo: 'Oferta Flash', descuento: '-40%' },
    { imagen: 'assets/barcakit.png', titulo: 'Oferta Flash', descuento: '-33%' }
  ];

  currentIndex: number = 0;

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.ofertas.length; 
  }

  previous() {
    this.currentIndex = (this.currentIndex - 1 + this.ofertas.length) % this.ofertas.length; 
  }

  get visibleOffers() {

    return [
      this.ofertas[this.currentIndex],
      this.ofertas[(this.currentIndex + 1) % this.ofertas.length],
      this.ofertas[(this.currentIndex + 2) % this.ofertas.length],
      this.ofertas[(this.currentIndex + 3) % this.ofertas.length]
    ];
  }
}
