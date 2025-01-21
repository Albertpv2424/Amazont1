import { Component } from '@angular/core';

@Component({
  selector: 'app-ofertones',
  standalone: true,
  templateUrl: './ofertones.component.html',
  styleUrls: ['./ofertones.component.css']
})
export class OfertonesComponent {
  ofertas = [
    { imagen: 'assets/fifa25.png', titulo: 'Oferta Flash', descuento: '-46%' },
    { imagen: 'assets/panales.png', titulo: 'Oferta Flash', descuento: '-29%' },
    { imagen: 'assets/scalextric.png', titulo: 'Oferta Flash', descuento: '-20%' },
    { imagen: 'assets/nba2k25.png', titulo: 'Oferta Flash', descuento: '-40%' },
    { imagen: 'assets/barcakit.png', titulo: 'Oferta Flash', descuento: '-33%' }
  ];

  // Tres posiciones visibles del carrusel
  oferta1 = this.ofertas[0];
  oferta2 = this.ofertas[1];
  oferta3 = this.ofertas[2];

  // Índice de inicio
  currentIndex = 0;

  // Método para avanzar al siguiente conjunto de ofertas
  next() {
    this.currentIndex = (this.currentIndex + 1) % this.ofertas.length;
    this.updateVisibleOffers();
  }

  // Método para retroceder al conjunto anterior de ofertas
  previous() {
    this.currentIndex =
      (this.currentIndex - 1 + this.ofertas.length) % this.ofertas.length;
    this.updateVisibleOffers();
  }

  // Actualiza las ofertas visibles en el carrusel
  updateVisibleOffers() {
    this.oferta1 = this.ofertas[this.currentIndex];
    this.oferta2 = this.ofertas[(this.currentIndex + 1) % this.ofertas.length];
    this.oferta3 = this.ofertas[(this.currentIndex + 2) % this.ofertas.length];
  }
}
