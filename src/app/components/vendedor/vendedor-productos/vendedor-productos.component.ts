import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendedorService } from '../../../services/vendedor.service';  // Fix path
import { Producto } from '../../../interfaces/producto.interface';  // Fix path
import { ThemeService } from '../../../services/theme.service';  // Fix path

@Component({
  selector: 'app-vendedor-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendedor-productos.component.html',
  styleUrls: ['./vendedor-productos.component.css']
})
export class VendedorProductosComponent implements OnInit {
  @Output() editarProducto = new EventEmitter<Producto>();

  productos: Producto[] = [];
  cargando = true;
  error = '';
  isDarkMode = false;

  constructor(
    private vendedorService: VendedorService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();

    this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
  }

  cargarProductos(): void {
    this.cargando = true;
    this.vendedorService.getProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los productos. Por favor, inténtalo de nuevo.';
        this.cargando = false;
        console.error('Error fetching products:', err);
      }
    });
  }

  onEditarProducto(producto: Producto): void {
    this.editarProducto.emit(producto);
  }

  onEliminarProducto(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.')) {
      this.vendedorService.eliminarProducto(id).subscribe({
        next: () => {
          this.productos = this.productos.filter(p => p.id !== id);
        },
        error: (err) => {
          console.error('Error deleting product:', err);
          alert('Error al eliminar el producto. Por favor, inténtalo de nuevo.');
        }
      });
    }
  }
}