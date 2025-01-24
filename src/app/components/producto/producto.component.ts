import { Component, input } from '@angular/core';
import { Producto } from '../../interfaces/producto.interface';

@Component({
  selector: 'app-producto',
  standalone: true,
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent {
  producto = input<Producto>({
    imagen: 'assets/default.png',
    titulo: 'Producto sin título',
    descuento: '0%'
  });

  get productoValue(): Producto {
    return this.producto();
  }
}
