// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { ThemeService } from './services/theme.service';
import { CarritoService } from './services/carrito.service';
import { ProductosService } from './services/productos.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  isDarkMode = false;

  constructor(private themeService: ThemeService, private carritoService: CarritoService, private productosService: ProductosService) {
    // For testing - add a product to cart on app init
    // Remove this in production
    this.addTestProductToCart();
  }

  // For testing purposes only - remove in production
  private addTestProductToCart(): void {
    // Get the first product from the service
    const productos = this.productosService.getAllProductos();
    if (productos.length > 0) {
      setTimeout(() => {
        this.carritoService.agregarProducto(productos[0], 1);
        console.log('Test product added to cart:', productos[0]);
      }, 1000);
    }
  }

  ngOnInit() {
    this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
    this.themeService.initializeTheme();
  }

  toggleBackground() {
    this.themeService.toggleDarkMode();
  }
}
