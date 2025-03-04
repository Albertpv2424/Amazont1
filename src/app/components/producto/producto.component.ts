// src/app/components/producto/producto.component.ts
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Producto } from '../../interfaces/producto.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent {
  @Input() producto!: Producto;

  constructor(private router: Router) {}

  navegarAProducto() {
    if (this.producto.id) {
      // Navegar a la ruta de detalle del producto
      this.router.navigate(['/producto', this.producto.id]);
    } else {
      console.error('El producto no tiene ID definido');
    }
  }
}