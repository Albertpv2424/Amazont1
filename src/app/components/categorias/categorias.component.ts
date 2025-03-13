import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaComponent } from '../categoria/categoria.component';
import { Categoria } from '../../interfaces/categoria.interface';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css'],
  imports: [CategoriaComponent, CommonModule]
})
export class CategoriasComponent implements OnInit {
  isDarkMode = false;
  
  categorias: Categoria[] = [
    { nombre: 'Tecnología', imagen: 'assets/tecnologia.png' },
    { nombre: 'Deportes', imagen: 'assets/deportes.png' },
    { nombre: 'Cocina', imagen: 'assets/cocina.png' }
  ];
  
  constructor(private themeService: ThemeService) {}
  
  ngOnInit() {
    this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
  }
}
