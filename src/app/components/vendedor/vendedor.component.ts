import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VendedorService } from '../../services/vendedor.service';  // Fix path
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { Producto } from '../../interfaces/producto.interface';
import { VendedorProductosComponent } from './vendedor-productos/vendedor-productos.component';
import { VendedorFormularioComponent } from './vendedor-formulario/vendedor-formulario.component';
import { VendedorEstadisticasComponent } from './vendedor-estadisticas/vendedor-estadisticas.component';

@Component({
  selector: 'app-vendedor',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    VendedorProductosComponent,
    VendedorFormularioComponent,
    VendedorEstadisticasComponent
  ],
  templateUrl: './vendedor.component.html',
  styleUrl: './vendedor.component.css'
})
export class VendedorComponent implements OnInit {
  isDarkMode = false;
  isVendedor = false;
  vistaActual = 'productos'; // 'productos', 'formulario', 'estadisticas'
  productoSeleccionado: Producto | null = null;
  modoEdicion = false;

  constructor(
    private vendedorService: VendedorService,
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router // Properly inject the Router service
  ) {}

  ngOnInit(): void {
    // Check if user is a vendor (case-insensitive)
    const currentUser = this.authService.getCurrentUser();
    this.isVendedor = currentUser?.rol?.toLowerCase() === 'vendedor';

    // If not a vendor, redirect to home
    if (!this.isVendedor) {
      console.log('No es vendedor, redirigiendo a home');
      this.router.navigate(['/']);
    }

    // Subscribe to theme changes
    this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
  }

  cambiarVista(vista: string): void {
    this.vistaActual = vista;
    if (vista !== 'formulario') {
      this.productoSeleccionado = null;
      this.modoEdicion = false;
    }
  }

  editarProducto(producto: Producto): void {
    this.productoSeleccionado = producto;
    this.modoEdicion = true;
    this.vistaActual = 'formulario';
  }

  nuevoProducto(): void {
    this.productoSeleccionado = null;
    this.modoEdicion = false;
    this.vistaActual = 'formulario';
  }

  onProductoGuardado(): void {
    this.vistaActual = 'productos';
    this.productoSeleccionado = null;
    this.modoEdicion = false;
  }
}
