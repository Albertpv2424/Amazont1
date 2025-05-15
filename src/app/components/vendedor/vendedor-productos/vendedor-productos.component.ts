import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VendedorService } from '../../../services/vendedor.service';
import { Producto } from '../../../interfaces/producto.interface';

@Component({
  selector: 'app-vendedor-productos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vendedor-productos.component.html',
  styleUrl: './vendedor-productos.component.css'
})
export class VendedorProductosComponent implements OnInit {
  productos: Producto[] = [];
  isLoading = true;
  error = '';

  constructor(private vendedorService: VendedorService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.isLoading = true;
    this.vendedorService.getProductos().subscribe({
      next: (data: Producto[]) => {
        this.productos = data;
        this.isLoading = false;
      },
      error: (err: Error) => {
        console.error('Error al cargar productos:', err);
        this.error = 'Error al cargar los productos. Por favor, inténtelo de nuevo más tarde.';
        this.isLoading = false;
      }
    });
  }

  eliminarProducto(id: number | undefined): void {
    if (id === undefined) {
      console.error('Error: ID del producto no definido');
      return;
    }
    
    if (confirm('Estàs segur que vols eliminar aquest producte?')) {
      this.vendedorService.eliminarProducto(id).subscribe({
        next: () => {
          this.productos = this.productos.filter(p => p.id !== id);
        },
        error: (err: Error) => {
          console.error('Error al eliminar el producto:', err);
          alert('Error al eliminar el producto. Por favor, inténtelo de nuevo.');
        }
      });
    }
  }
}
