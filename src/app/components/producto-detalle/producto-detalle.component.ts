import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producto-detalle.component.html',
  styleUrls: ['./producto-detalle.component.css']
})
export class ProductoDetalleComponent implements OnInit {
  producto: any = {};
  isDarkMode = false;
  categoriaActual: string | null = null;
  cantidad: number = 1;
  mostrarPopup: boolean = false; // Add this property
  
  constructor(
    private route: ActivatedRoute,
    private productosService: ProductosService,
    private themeService: ThemeService,
    private carritoService: CarritoService
  ) {}
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    this.productosService.getProductoById(id).subscribe(data => {
      if (data) {
        this.producto = data;
        console.log('Producto cargado:', this.producto);
      } else {
        console.error('Producto no encontrado con ID:', id);
      }
    });
    
    this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
  }

  anadirAlCarrito() {
    this.carritoService.agregarProducto(this.producto, this.cantidad);
    console.log('Producto añadido al carrito:', this.producto);
  }

  incrementarCantidad() {
    // Verificar si ya alcanzó el stock máximo
    if (this.cantidad < this.producto.stock) {
      this.cantidad++;
    } else {
      this.mostrarPopup = true; // Now this property is defined
    }
  }

  decrementarCantidad() {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }
  
  cerrarPopup() {
    this.mostrarPopup = false;
  }
}