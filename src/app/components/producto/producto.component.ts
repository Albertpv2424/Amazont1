import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Producto } from '../../interfaces/producto.interface';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent {
  @Input() producto!: Producto;

  constructor(
    private router: Router,
    private carritoService: CarritoService
  ) {}

  navegarAProducto() {
    if (this.producto.id) {
      // Fix the navigation path to use 'producto/:id'
      this.router.navigate(['/producto', this.producto.id]);
    } else {
      console.error('El producto no tiene ID definido');
    }
  }

  agregarAlCarrito(event: Event) {
    event.stopPropagation(); // Prevent navigation to product detail
    this.carritoService.agregarProducto(this.producto);
    console.log('Producto añadido al carrito:', this.producto);
  }
}