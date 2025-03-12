import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-recomendados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recomendados.component.html',
  styleUrls: ['./recomendados.component.css']
})
export class RecomendadosComponent implements OnInit {
  isDarkMode = false;
  
  recomendados = [
    { imagen: 'assets/maquillaje.png', descripcion: 'Belleza y Regalos' },
    { imagen: 'assets/regalos.png', descripcion: 'Regalos perfectos para tus seres queridos' }
  ];

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
  }
}
