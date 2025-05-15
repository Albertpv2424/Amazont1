import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendedorService, EstadisticasResponse } from '../../../services/vendedor.service';

@Component({
  selector: 'app-vendedor-estadisticas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendedor-estadisticas.component.html',
  styleUrl: './vendedor-estadisticas.component.css'
})
export class VendedorEstadisticasComponent implements OnInit {
  estadisticas: any = {};
  isLoading = true;
  error = '';

  constructor(private vendedorService: VendedorService) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.isLoading = true;
    this.vendedorService.getEstadisticas().subscribe({
      next: (data: EstadisticasResponse) => {
        this.estadisticas = data.estadisticas;
        this.isLoading = false;
      },
      error: (err: Error) => {
        console.error('Error al cargar estadísticas:', err);
        this.error = 'Error al cargar las estadísticas. Por favor, inténtelo de nuevo más tarde.';
        this.isLoading = false;
      }
    });
  }
}
