import { Component, input } from '@angular/core';
import { Router } from '@angular/router';
import { Categoria } from '../../interfaces/categoria.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent {
  categoria = input<Categoria>({
    nombre: 'Sin nombre',
    imagen: 'assets/default.png'
  });

  constructor(private router: Router) {}

  get categoriaValue(): Categoria {
    return this.categoria();
  }

  navegarACategoria() {
    this.router.navigate(['/categoria', this.categoria().nombre]);
  }
}
