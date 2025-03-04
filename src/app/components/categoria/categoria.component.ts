import { Component, Input } from '@angular/core';
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
  @Input() categoria!: Categoria;

  constructor(private router: Router) {}

  navegarACategoria() {
    console.log('Navegando a categoría:', this.categoria.nombre);
    this.router.navigate(['/categoria', this.categoria.nombre]);
  }
}
