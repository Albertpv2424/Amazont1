import { Component } from '@angular/core';

@Component({
  selector: 'app-categorias',
  standalone: true,
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent {
  categorias = [
    { nombre: 'Tecnología', imagen: 'assets/tecnologia.jpg' },
    { nombre: 'Deportes', imagen: 'assets/deportes.jpg' },
    { nombre: 'Cocina', imagen: 'assets/cocina.jpg' }
  ];
}
