import { Component } from '@angular/core';

@Component({
  selector: 'app-ofertones',
  standalone: true,
  templateUrl: './ofertones.component.html',
  styleUrls: ['./ofertones.component.css']
})
export class OfertonesComponent {
  ofertas = [
    { imagen: 'assets/fifa25.jpg', titulo: 'FIFA 25', descuento: '-46%' },
    { imagen: 'assets/panales.jpg', titulo: 'Dodot Sensitive', descuento: '-29%' }
  ];
}
