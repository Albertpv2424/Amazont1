import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VendedorService } from '../../../services/vendedor.service';
import { Producto } from '../../../interfaces/producto.interface';
import { ProductosService } from '../../../services/productos.service';
import { HttpClient } from '@angular/common/http';

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

  constructor(
    private vendedorService: VendedorService,
    private productosService: ProductosService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.isLoading = true;
    this.vendedorService.getProductos().subscribe({
      next: (response: any) => {
        console.log('Resposta del servidor:', response);
        
        // Comprovem diferents possibles estructures de la resposta
        if (Array.isArray(response)) {
          // Si la resposta és directament un array
          this.productos = response;
        } else if (response.productos && Array.isArray(response.productos)) {
          // Si la resposta té una propietat 'productos' que és un array
          this.productos = response.productos;
        } else if (response.data && Array.isArray(response.data)) {
          // Si la resposta té una propietat 'data' que és un array
          this.productos = response.data;
        } else if (response.productos && response.productos.data && Array.isArray(response.productos.data)) {
          // Si la resposta té una estructura anidada com 'productos.data'
          this.productos = response.productos.data;
        } else {
          // Si no podem trobar un array vàlid, inicialitzem amb un array buit
          console.error('Format de resposta no reconegut:', response);
          this.productos = [];
        }
        
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
