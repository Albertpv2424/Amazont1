import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoDetalleComponent } from '../producto-detalle/producto-detalle.component';

@NgModule({
  imports: [CommonModule, ProductoDetalleComponent],
  exports: [ProductoDetalleComponent]
})
export class ProductoModule {}

