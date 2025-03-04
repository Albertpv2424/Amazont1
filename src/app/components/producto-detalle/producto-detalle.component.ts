import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

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
  
  constructor(
    private route: ActivatedRoute,
    private productosService: ProductosService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productosService.getProductoById(id).subscribe(data => {
      this.producto = data;
    });
    
    this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
  }

  anadirAlCarrito() {
    // Lógica para añadir el producto al carrito
    console.log('Producto añadido al carrito');
  }
}