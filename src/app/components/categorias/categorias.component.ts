import { Component } from '@angular/core';
import { Categoria } from '../../interfaces/categoria.interface';
import { CategoriaComponent } from '../categoria/categoria.component'; // Ajusta la ruta aquí

@Component({
  selector: 'app-categorias',
  standalone: true,
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css'],
  imports: [CategoriaComponent]
})
export class CategoriasComponent {
  categorias: Categoria[] = [
    { nombre: 'Tecnología', imagen: 'assets/tecnologia.jpg' },
    { nombre: 'Deportes', imagen: 'assets/deportes.jpg' },
    { nombre: 'Cocina', imagen: 'assets/cocina.jpg' }
  ];
}