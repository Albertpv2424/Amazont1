import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaComponent } from '../categoria/categoria.component';
import { Categoria } from '../../interfaces/categoria.interface';
import { ThemeService } from '../../services/theme.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-categorias',
  standalone: true,
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css'],
  imports: [CategoriaComponent, CommonModule]
})
export class CategoriasComponent implements OnInit {
  isDarkMode = false;
  categorias: any[] = [];

  constructor(private themeService: ThemeService, private http: HttpClient) {}

  ngOnInit() {
    this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
    this.http.get<any>('http://localhost:8000/api/categorias').subscribe({
      next: (response) => {
        this.categorias = response.categorias;
      },
      error: (err) => {
        console.error('Error carregant categories des de l\'API:', err);
        this.categorias = [];
      }
    });
  }
}
