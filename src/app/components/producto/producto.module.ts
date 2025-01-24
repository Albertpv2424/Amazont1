import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoComponent } from './producto.component';

@NgModule({
  declarations: [ProductoComponent],
  imports: [CommonModule],
  exports: [ProductoComponent]
})
export class ProductoModule {}

