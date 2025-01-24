import { Component, Input } from '@angular/core';
import { Categoria } from '../../interfaces/categoria.interface';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-categoria',
  standalone: true,
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css'],
})
export class CategoriaComponent {
  @Input() categoria!: Categoria; // Recibe la categoría como input
}