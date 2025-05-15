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

  agregarAlCarrito() {
    if (this.producto?.id) {  // Verificación adicional de null
      this.carritoService.addToCart(this.producto.id, 1).subscribe({
        next: () => {
          console.log('Producto añadido al carrito');
        },
        error: (error) => {
          console.error('Error al añadir al carrito:', error);
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
        }
      });
    } else {
      console.error('El producto no tiene ID definido');
    }
  }
}