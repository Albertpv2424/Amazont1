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
    console.log('Producto a añadir:', this.producto);
    
    // Verificar si tenemos id o id_prod (similar al problema que vimos antes)
    const productoId = this.producto?.id || this.producto?.id_prod;
    
    if (productoId) {
      // Mostrar algún indicador visual de carga
      const boton = document.querySelector('.btn-agregar-carrito') as HTMLButtonElement;
      if (boton) {
        boton.disabled = true;
        boton.textContent = 'Añadiendo...';
      }
      
      this.carritoService.addToCart(productoId, 1).subscribe({
        next: (response) => {
          console.log('Producto añadido al carrito correctamente:', response);
          
          // Restaurar el botón y mostrar confirmación
          if (boton) {
            boton.disabled = false;
            boton.textContent = '✓ Añadido';
            
            // Volver al texto original después de un tiempo
            setTimeout(() => {
              boton.textContent = 'Añadir al carrito';
            }, 2000);
          }
        },
        error: (error) => {
          console.error('Error al añadir al carrito:', error);
          
          // Restaurar el botón
          if (boton) {
            boton.disabled = false;
            boton.textContent = 'Añadir al carrito';
          }
          
          if (error.status === 401) {
            this.router.navigate(['/login']);
          } else {
            // Mostrar algún mensaje de error
            alert('Error al añadir el producto al carrito. Inténtalo de nuevo.');
          }
        }
      });
    } else {
      console.error('El producto no tiene ID definido:', this.producto);
      alert('No se puede añadir este producto al carrito.');
    }
  }
}