import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VendedorService } from '../../../services/vendedor.service';
import { Producto } from '../../../interfaces/producto.interface';
import { ProductosService } from '../../../services/productos.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-vendedor-productos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './vendedor-productos.component.html',
  styleUrl: './vendedor-productos.component.css'
})
export class VendedorProductosComponent implements OnInit {
  productos: Producto[] = [];
  isLoading = true;
  error = '';
  
  // Variables para el modal
  mostrarModal = false;
  productoEditando: Producto | null = null;

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

 

  // Métodos para el modal
  abrirModalEditar(producto: Producto): void {
    // Creamos una copia del producto para no modificar el original directamente
    this.productoEditando = { ...producto };
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.productoEditando = null;
  }

  guardarCambios(): void {
    console.log('Producte a editar:', this.productoEditando);
    
    // Verificar si tenemos id_prod en lugar de id
    const productoId = this.productoEditando?.id || this.productoEditando?.id_prod;
    console.log('ID del producte:', productoId);
    
    if (!this.productoEditando || !productoId) {
      console.error('No hi ha cap producte per editar o falta l\'ID');
      return;
    }

    this.isLoading = true;
    this.vendedorService.actualizarProducto(productoId, this.productoEditando).subscribe({
      next: (response) => {
        console.log('Producte actualitzat correctament:', response);
        
        // Actualitzem el producte a la llista
        const index = this.productos.findIndex(p => (p.id === productoId || p.id_prod === productoId));
        if (index !== -1) {
          this.productos[index] = { ...this.productoEditando! } as Producto;
        }
        
        this.cerrarModal();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al actualitzar el producte:', err);
        this.error = 'Error al actualitzar el producte. Si us plau, intenta-ho de nou més tard.';
        this.isLoading = false;
      }
    });
  }

  eliminarProducto(id: number): void {
    if (confirm('Estàs segur que vols eliminar aquest producte? Aquesta acció no es pot desfer.')) {
      this.isLoading = true;
      this.vendedorService.eliminarProducto(id).subscribe({
        next: () => {
          console.log('Producte eliminat correctament');
          // Eliminem el producte de la llista
          this.productos = this.productos.filter(p => p.id !== id);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al eliminar el producte:', err);
          this.error = 'Error al eliminar el producte. Si us plau, intenta-ho de nou més tard.';
          this.isLoading = false;
        }
      });
    }
  }
}
