import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VendedorService } from '../../../services/vendedor.service';
import { Producto } from '../../../interfaces/producto.interface';
import { ProductosService } from '../../../services/productos.service';
import { HttpClient } from '@angular/common/http';
import { ThemeService } from '../../../services/theme.service';


@Component({
  selector: 'app-vendedor-productos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './vendedor-productos.component.html',
  styleUrl: './vendedor-productos.component.css'
})
export class VendedorProductosComponent implements OnInit {
  productos: Producto[] = [];
  isLoading = true;
  error = '';
  isDarkMode = false;

  // Variables para el modal
  mostrarModal = false;
  productoEditando: Producto | null = null;

  constructor(
    private vendedorService: VendedorService,
    private productosService: ProductosService,
    private themeService: ThemeService,
    private http: HttpClient  // Properly inject HttpClient here
  ) {}

  // Añade estas propiedades y métodos al componente
  // Propiedad para el modo oscuro

  // Propiedad para la vista previa de la imagen
  imagenPreview: string | null = null;

  // Método para obtener la URL de la imagen
  getImageUrl(producto: any): string {
    if (!producto.imagen) {
      return 'assets/images/no-image.png';
    }

    // Comprobar si la imagen es una cadena base64
    if (typeof producto.imagen === 'string' && producto.imagen.startsWith('data:image')) {
      return producto.imagen;
    }

    // Comprobar si la ruta ya incluye 'assets/'
    if (typeof producto.imagen === 'string' && producto.imagen.includes('assets/')) {
      return producto.imagen;
    }

    // Si es una URL completa
    if (typeof producto.imagen === 'string' && (producto.imagen.startsWith('http://') || producto.imagen.startsWith('https://'))) {
      return producto.imagen;
    }

    // En otro caso, añadir 'assets/' a la ruta
    return `assets/${producto.imagen}`;
  }

  // Método para obtener la URL de la imagen de vista previa
  getPreviewImageUrl(): string {
    if (this.imagenPreview) {
      return this.imagenPreview;
    }

    if (!this.productoEditando || !this.productoEditando.imagen) {
      return 'assets/images/no-image.png';
    }

    return this.getImageUrl(this.productoEditando);
  }

  // Método para manejar el cambio de imagen
  onImagenChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Convertir a base64 para la vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result as string;
        if (this.productoEditando) {
          this.productoEditando.imagen = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // Método para actualizar la vista previa de la imagen
  actualizarImagenPreview(): void {
    if (this.productoEditando && this.productoEditando.imagen) {
      this.imagenPreview = this.getImageUrl(this.productoEditando);
    } else {
      this.imagenPreview = null;
    }
  }

  // Actualizar el método cerrarModal para resetear la vista previa de la imagen
  cerrarModal(): void {
    this.mostrarModal = false;
    this.productoEditando = null;
    this.imagenPreview = null;
  }

  // Actualizar el método abrirModalEditar para establecer la vista previa de la imagen
  abrirModalEditar(producto: any): void {
    // Crear una copia del producto para no modificar el original directamente
    this.productoEditando = { ...producto };
    this.imagenPreview = this.getImageUrl(producto);
    this.mostrarModal = true;
  }

  // Actualizar el método cargarProductos para asegurar que se muestren todos los productos
  cargarProductos(): void {
    this.isLoading = true;
    this.error = '';

    // Obtener el token de autenticación
    const token = localStorage.getItem('auth_token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // Usar la nueva ruta de API para vendedores
    this.http.get('http://127.0.0.1:8000/api/seller/prods', { headers }).subscribe({
      next: (response: any) => {
        console.log('Respuesta del servidor:', response);

        let allProducts = [];

        // Comprobar diferentes posibles estructuras de respuesta
        if (Array.isArray(response)) {
          allProducts = response;
        } else if (response.productos && Array.isArray(response.productos)) {
          allProducts = response.productos;
        } else if (response.data && Array.isArray(response.data)) {
          allProducts = response.data;
        } else if (response.productos && response.productos.data && Array.isArray(response.productos.data)) {
          allProducts = response.productos.data;
        } else {
          console.error('Formato de respuesta no reconocido:', response);
          this.error = 'Error al procesar los datos de productos.';
          allProducts = [];
        }

        // Asegurarse de que estamos obteniendo todos los productos, no solo los primeros 10
        this.productos = allProducts;

        console.log('Productos cargados:', this.productos.length);
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar productos:', error);
        this.error = 'Error al cargar los productos. Por favor, inténtalo de nuevo más tarde.';
        this.isLoading = false;
      }
    });
  }

  // Añadir al ngOnInit para detectar el modo oscuro
  // Añade esta propiedad para almacenar las categorías
  categorias: any[] = [];

  // Añade este método para obtener la categoría de un producto
  getCategoriaProducto(producto: any): string {
    // Si el producto tiene una propiedad categoria directa, la usamos
    if (producto.categoria) {
      return producto.categoria;
    }

    // Si el producto tiene categorías como array, tomamos la primera
    if (producto.categorias && Array.isArray(producto.categorias) && producto.categorias.length > 0) {
      return producto.categorias[0].nombre;
    }

    // Si el producto tiene una relación categoria_nombre
    if (producto.categoria_nombre) {
      return producto.categoria_nombre;
    }

    return 'Sin categoría';
  }

  // Modifica el ngOnInit para cargar las categorías
  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();

    // Subscripció al servei de tema
    this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );  
  }

  // Añade este método para cargar las categorías
  cargarCategorias(): void {
    this.vendedorService.getCategorias().subscribe({
      next: (response: any) => {
        console.log('Categorías cargadas:', response);

        // Extraer las categorías según la estructura de la respuesta
        if (Array.isArray(response)) {
          this.categorias = response;
        } else if (response.categorias && Array.isArray(response.categorias)) {
          this.categorias = response.categorias;
        } else {
          console.error('Formato de respuesta de categorías no reconocido:', response);
          this.categorias = [];
        }
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.categorias = [];
      }
    });
  }

  guardarCambios(): void {
    console.log('Producte a editar:', this.productoEditando);

    // Verificar si tenemos id_prod en lugar de id
    const productoId = this.productoEditando?.id || this.productoEditando?.id_prod;
    console.log('ID del producte:', productoId);

    if (!this.productoEditando || !productoId) {
      console.error('No hi ha cap producte per editar o falta l\'ID');
      return;
    }

    this.isLoading = true;
    this.vendedorService.actualizarProducto(productoId, this.productoEditando).subscribe({
      next: (response) => {
        console.log('Producte actualitzat correctament:', response);

        // Actualitzem el producte a la llista
        const index = this.productos.findIndex(p => (p.id === productoId || p.id_prod === productoId));
        if (index !== -1) {
          this.productos[index] = { ...this.productoEditando! } as Producto;
        }

        this.cerrarModal();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al actualitzar el producte:', err);
        this.error = 'Error al actualitzar el producte. Si us plau, intenta-ho de nou més tard.';
        this.isLoading = false;
      }
    });
  }

  eliminarProducto(id: number): void {
    if (confirm('Estàs segur que vols eliminar aquest producte? Aquesta acció no es pot desfer.')) {
      this.isLoading = true;
      this.vendedorService.eliminarProducto(id).subscribe({
        next: () => {
          console.log('Producte eliminat correctament');
          // Eliminem el producte de la llista, tenint en compte tant id com id_prod
          this.productos = this.productos.filter(p => (p.id !== id && p.id_prod !== id));
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al eliminar el producte:', err);
          this.error = 'Error al eliminar el producte. Si us plau, intenta-ho de nou més tard.';
          this.isLoading = false;
        }
      });
    }
  }
}
