import { Component, input, output } from '@angular/core';
import { Categoria } from '../../interfaces/categoria.interface';
import { CategoriaComponent } from '../categoria/categoria.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categorias',
  standalone: true,
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css'],
  imports: [CategoriaComponent, CommonModule]
})
export class CategoriasComponent {
  categorias = input<Categoria[]>([
    { nombre: 'Tecnología', imagen: 'assets/tecnologia.png' },
    { nombre: 'Deportes', imagen: 'assets/deportes.png' },
    { nombre: 'Cocina', imagen: 'assets/cocina.png' }
  ]);

  categoriaSeleccionada = output<Categoria>();

  onCategoriaSeleccionada(categoria: Categoria) {
    this.categoriaSeleccionada.emit(categoria);
  }
}
