import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Categoria } from '../../interfaces/categoria.interface';
import { ProductosService } from '../../services/productos.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule]
})
export class HeaderComponent implements OnInit {
  @Input() isDarkMode: boolean = false;
  @Output() backgroundToggled = new EventEmitter<void>();
  
  isLoggedIn = false;
  userName: string = '';
  searchTerm: string = '';
  filteredProducts: any[] = [];
  showSuggestions: boolean = false;
  
  categorias: Categoria[] = [
    { nombre: 'Tecnología', imagen: 'assets/tecnologia.png' },
    { nombre: 'Deportes', imagen: 'assets/deportes.png' },
    { nombre: 'Cocina', imagen: 'assets/cocina.png' }
  ];
  
  cantidadCarrito: number = 0;
  
  constructor(
    private router: Router,
    private authService: AuthService,
    private productosService: ProductosService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      console.log('HEADER: isLoggedIn canviat:', isLoggedIn); // DEBUG
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        const user = this.authService.getCurrentUser();
        if (user) {
          this.userName = user.nombre;
        }
      } else {
        this.userName = '';
      }
    });
    
    // Subscribe to cart changes
    this.carritoService.getCarrito().subscribe(items => {
      this.cantidadCarrito = this.carritoService.obtenerCantidadTotal();
    });
  }

  toggleBackground() {
    this.backgroundToggled.emit();
  }

  logout() {
    this.authService.logout();
  }
  
  navegarACategoria(categoria: string) {
    this.router.navigate(['/categoria', categoria]);
  }
  
  navegarACategorias() {
    this.router.navigate(['/categorias']);
  }

  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    
    if (value) {
      this.navegarACategoria(value);
    } else {
      this.navegarACategorias();
    }
  }

  // In your component, modify the method that shows suggestions
  onSearchInput(): void {
    console.log('Search term:', this.searchTerm);
    if (this.searchTerm && this.searchTerm.trim().length > 1) {
      const term = this.searchTerm.trim().toLowerCase();
      this.filteredProducts = this.productosService.getAllProductos()
        .filter(producto => 
          producto.nombre.toLowerCase().includes(term) ||
          (producto.descripcion && producto.descripcion.toLowerCase().includes(term))
        )
        .slice(0, 10); // Limit to 10 results
      
      console.log('Filtered products:', this.filteredProducts.length);
      this.showSuggestions = this.filteredProducts.length > 0;
      
      // Remove the code that tries to append to body as it's causing issues
      // Instead, let Angular handle the rendering in the template
    } else {
      this.filteredProducts = [];
      this.showSuggestions = false;
    }
  }

  selectSuggestion(producto: any): void {
    this.searchTerm = producto.nombre;
    this.showSuggestions = false;
    if (producto.id) {
      this.router.navigate(['/producto', producto.id]);
    }
  }

  buscarProductos(): void {
    if (this.searchTerm && this.searchTerm.trim()) {
      const term = this.searchTerm.trim();
      console.log('Buscando:', term);
      // Navigate to the search results page with the search term as a query parameter
      this.router.navigate(['/busqueda'], { 
        queryParams: { q: term } 
      });
      // Hide suggestions after search
      this.showSuggestions = false;
    }
  }

  hideSuggestions(): void {
    // Use setTimeout to allow click events to complete before hiding
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  navegarAlPerfil(): void {
    this.router.navigate(['/perfil-usuario']);
  }
  navegarAlCarrito(): void {
    this.router.navigate(['/carrito']);
  }

  navegarAjustes(): void {
    this.router.navigate(['/perfil-usuario']);
  }
}
