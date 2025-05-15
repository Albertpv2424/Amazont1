import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendedorService } from '../../../services/vendedor.service';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-vendedor-estadisticas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendedor-estadisticas.component.html',
  styleUrls: ['./vendedor-estadisticas.component.css']
})
export class VendedorEstadisticasComponent implements OnInit {
  estadisticas: any = {};
  cargando = true;
  error = '';
  isDarkMode = false;
  
  constructor(
    private vendedorService: VendedorService,
    private themeService: ThemeService
  ) {}
  
  ngOnInit(): void {
    this.cargarEstadisticas();
    
    this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
  }
  
  cargarEstadisticas(): void {
    this.cargando = true;
    this.vendedorService.getEstadisticasVentas().subscribe({
      next: (data) => {
        this.estadisticas = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las estadísticas. Por favor, inténtalo de nuevo.';
        this.cargando = false;
        console.error('Error fetching statistics:', err);
      }
    });
  }
}
