import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../services/productos.service';
import { ProductoCategoria } from '../../interfaces/producto-categoria.interface';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';
import { ProductoComponent } from '../producto/producto.component';
import { AuthService } from '../../services/auth.service';
import { CarritoService } from '../../services/carrito.service'; // Add this import
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ofertones',
  templateUrl: './ofertones.component.html',
  styleUrls: ['./ofertones.component.css'],
  standalone: true,
  imports: [CommonModule, ProductoComponent]
})
export class OfertonesComponent implements OnInit {
  productos: ProductoCategoria[] = [];
  ofertas: ProductoCategoria[] = [];
  visibleOffers: ProductoCategoria[] = [];
  currentIndex = 0;
  itemsPerPage = 3;
  isDarkMode = false;
  isLoggedIn = false;
  userName = '';
  cantidadCarrito: number = 0; // Add cart quantity
  router: any;

  constructor(
    private productosService: ProductosService,
    private themeService: ThemeService,
    private authService: AuthService,
    private carritoService: CarritoService,
    private http: HttpClient // Add HttpClient here
  ) {}

  ngOnInit(): void {
    // Fetch products from API
    this.http.get<any>('http://localhost:8000/api/products').subscribe({
      next: (response) => {
        console.log('Productes rebuts:', response.productos.data); // <-- Afegit per depuració
        // Filtrar només els productes amb oferta
        this.ofertas = response.productos.data.filter((p: any) => 
          p.precio_oferta && p.precio_oferta < p.precio
        );
        this.updateVisibleOffers();
      },
      error: (err) => {
        console.error('Error fetching products from API:', err);
        this.ofertas = [];
        this.updateVisibleOffers();
      }
    });

    // Add login state handling
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      console.log('OFERTONES: isLoggedIn changed:', isLoggedIn); // DEBUG
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
    this.themeService.darkMode$.subscribe(isDarkMode => {
      this.isDarkMode = isDarkMode;
    })
  }

  updateVisibleOffers(): void {
    // Si hi ha menys ofertes que itemsPerPage, mostra totes
    if (this.ofertas.length <= this.itemsPerPage) {
      this.visibleOffers = this.ofertas.slice();
      return;
    }
    // Si el currentIndex + itemsPerPage sobrepassa el final, agafa del final i del principi
    if (this.currentIndex + this.itemsPerPage > this.ofertas.length) {
      const endSlice = this.ofertas.slice(this.currentIndex);
      const startSlice = this.ofertas.slice(0, (this.currentIndex + this.itemsPerPage) % this.ofertas.length);
      this.visibleOffers = endSlice.concat(startSlice);
    } else {
      this.visibleOffers = this.ofertas.slice(this.currentIndex, this.currentIndex + this.itemsPerPage);
    }
  }

  next(): void {
    if (this.ofertas.length === 0) return;
    this.currentIndex = (this.currentIndex + this.itemsPerPage) % this.ofertas.length;
    this.updateVisibleOffers();
  }

  previous(): void {
    if (this.ofertas.length === 0) return;
    this.currentIndex = (this.currentIndex - this.itemsPerPage + this.ofertas.length) % this.ofertas.length;
    this.updateVisibleOffers();
  }

  afegirAlCarrito(producto: ProductoCategoria) {
    console.log('Producte seleccionat:', producto); // Afegit per depuració
    console.log('Producte ID:', producto.id_prod); // Afegit per depuració
    const no = producto.id_prod;
    if (producto ) { 
      this.carritoService.addToCart(Number(no), 1).subscribe({
        next: () => {
          console.log('Producte afegit correctament');
          this.carritoService.obtenerCantidadTotal();
        },
        error: (error) => {
          console.error('Error detallat:', error.error.errors);
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
        }
      });
    } else {
      console.error('Producte sense ID:', producto);
    }
  }
}
