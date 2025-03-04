import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producto-detalle.component.html',
  styleUrls: ['./producto-detalle.component.css']
})
export class ProductoDetalleComponent implements OnInit {
  producto: any = {};

  constructor(
    private route: ActivatedRoute,
    private productosService: ProductosService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productosService.getProductoById(id).subscribe(data => {
      this.producto = data;
    });
  }

  anadirAlCarrito() {
    // Lógica para añadir el producto al carrito
    console.log('Producto añadido al carrito');
  }
}