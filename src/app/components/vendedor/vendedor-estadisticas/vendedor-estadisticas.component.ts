import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendedorService, EstadisticasResponse } from '../../../services/vendedor.service';
import { Chart, registerables } from 'chart.js';

// Registrar todos los componentes de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-vendedor-estadisticas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendedor-estadisticas.component.html',
  styleUrl: './vendedor-estadisticas.component.css'
})
export class VendedorEstadisticasComponent implements OnInit, AfterViewInit {
  @ViewChild('ventasChart') ventasChartRef!: ElementRef;
  @ViewChild('categoriasChart') categoriasChartRef!: ElementRef;
  @ViewChild('popularesChart') popularesChartRef!: ElementRef;
  
  estadisticas: any = {
    ventasTotales: 0,
    productosVendidos: 0,
    pedidosCompletados: 0,
    valoracionMedia: 0,
    productosPopulares: [],
    productosBajoStock: [],
    categoriasMasUsadas: []
  };
  isLoading = true;
  error = '';
  
  // Referencias a los gráficos
  ventasChart: Chart | null = null;
  categoriasChart: Chart | null = null;
  popularesChart: Chart | null = null;

  constructor(private vendedorService: VendedorService) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
  }
  
  ngAfterViewInit(): void {
    // Los gráficos se crearán después de cargar los datos
  }

  cargarEstadisticas(): void {
    this.isLoading = true;
    this.vendedorService.getEstadisticas().subscribe({
      next: (data: EstadisticasResponse) => {
        this.estadisticas = data.estadisticas;
        this.isLoading = false;
        
        // Una vez cargados los datos, creamos los gráficos
        setTimeout(() => {
          this.crearGraficos();
        }, 100);
      },
      error: (err: Error) => {
        console.error('Error al cargar estadísticas:', err);
        this.error = 'Error al cargar las estadísticas. Por favor, inténtelo de nuevo más tarde.';
        this.isLoading = false;
      }
    });
  }
  
  crearGraficos(): void {
    this.crearGraficoVentas();
    this.crearGraficoCategorias();
    this.crearGraficoProductosPopulares();
  }
  
  crearGraficoVentas(): void {
    if (this.ventasChartRef && this.ventasChartRef.nativeElement) {
      // Datos de ejemplo para el gráfico de ventas (últimos 6 meses)
      const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
      const datos = [
        Math.round(this.estadisticas.ventasTotales * 0.1),
        Math.round(this.estadisticas.ventasTotales * 0.15),
        Math.round(this.estadisticas.ventasTotales * 0.12),
        Math.round(this.estadisticas.ventasTotales * 0.18),
        Math.round(this.estadisticas.ventasTotales * 0.2),
        Math.round(this.estadisticas.ventasTotales * 0.25)
      ];
      
      this.ventasChart = new Chart(this.ventasChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: meses,
          datasets: [{
            label: 'Ventas Mensuales (€)',
            data: datos,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }
  
  crearGraficoCategorias(): void {
    if (this.categoriasChartRef && this.categoriasChartRef.nativeElement && this.estadisticas.categoriasMasUsadas) {
      const categorias = this.estadisticas.categoriasMasUsadas.map((cat: any) => cat.nombre);
      const ventas = this.estadisticas.categoriasMasUsadas.map((cat: any) => cat.ventasTotales);
      
      this.categoriasChart = new Chart(this.categoriasChartRef.nativeElement, {
        type: 'pie',
        data: {
          labels: categorias,
          datasets: [{
            data: ventas,
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(153, 102, 255, 0.7)',
              'rgba(255, 159, 64, 0.7)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right'
            },
            title: {
              display: true,
              text: 'Ventas por Categoría'
            }
          }
        }
      });
    }
  }
  
  crearGraficoProductosPopulares(): void {
    if (this.popularesChartRef && this.popularesChartRef.nativeElement && this.estadisticas.productosPopulares) {
      const productos = this.estadisticas.productosPopulares.map((prod: any) => prod.nombre);
      const unidades = this.estadisticas.productosPopulares.map((prod: any) => prod.unidades);
      
      this.popularesChart = new Chart(this.popularesChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: productos,
          datasets: [{
            label: 'Unidades Vendidas',
            data: unidades,
            backgroundColor: 'rgba(75, 192, 192, 0.7)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          },
          indexAxis: 'y'  // Gráfico de barras horizontal
        }
      });
    }
  }
}
