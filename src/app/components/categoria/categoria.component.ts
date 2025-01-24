import { Component, input, Input } from '@angular/core';
import { Categoria } from '../../interfaces/categoria.interface';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-categoria',
  standalone: true,
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css'],
})
export class CategoriaComponent {
  categoria = input<Categoria>({
    nombre: 'Sin nombre',
    imagen: 'assets/default.png'
  });
  get categoriaValue(): Categoria {
    return this.categoria();
  }
}
