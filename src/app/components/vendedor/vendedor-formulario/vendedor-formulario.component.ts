import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VendedorService } from '../../../services/vendedor.service';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-vendedor-formulario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './vendedor-formulario.component.html',
  styleUrl: './vendedor-formulario.component.css'
})
export class VendedorFormularioComponent implements OnInit {
  productoForm!: FormGroup;
  categorias: any[] = [];
  isEditing = false;
  productoId: number | null = null;
  isLoading = false;
  isSubmitting = false;
  error = '';
  imagenPreview: string | null = null;
  isDarkMode = false;
  metodoImagen: 'archivo' | 'url' = 'archivo'; // Afegim aquesta propietat per controlar el mètode d'imatge

  constructor(
    private themeService: ThemeService,
    private fb: FormBuilder,
    private vendedorService: VendedorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarCategorias();
    

    // Check if we're editing an existing product
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.productoId = +params['id'];
        this.isEditing = true;
        this.cargarProducto(this.productoId);
      }
    });

    this.themeService.darkMode$.subscribe(isDarkMode => {
      this.isDarkMode = isDarkMode;
    });
  }

  initForm(): void {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0.01)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      en_oferta: [false],
      precio_oferta: [''],
      imagen_url: [''], // Afegim el camp per a la URL de la imatge
      categorias: [[], Validators.required]
    });

    // Add conditional validation for sale price
    this.productoForm.get('en_oferta')?.valueChanges.subscribe(value => {
      const precioOfertaControl = this.productoForm.get('precio_oferta');
      if (value) {
        precioOfertaControl?.setValidators([Validators.required, Validators.min(0.01)]);
      } else {
        precioOfertaControl?.clearValidators();
      }
      precioOfertaControl?.updateValueAndValidity();
    });
  }

  cargarCategorias(): void {
    this.vendedorService.getCategorias().subscribe({
      next: (data) => {
        console.log('Datos de categorías recibidos:', data);
        // Verificar si data es un objeto con una propiedad que contiene el array
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          // Buscar una propiedad que podría contener el array de categorías
          const posibleArray = Object.values(data).find(val => Array.isArray(val));
          this.categorias = Array.isArray(posibleArray) ? posibleArray : [];
        } else {
          this.categorias = Array.isArray(data) ? data : [];
        }
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        this.error = 'Error al cargar las categorías';
      }
    });
  }

  cargarProducto(id: number): void {
    this.isLoading = true;
    this.vendedorService.getProducto(id).subscribe({
      next: (producto) => {
        // Populate the form with product data
        this.productoForm.patchValue({
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio,
          stock: producto.stock,
          imagen: producto.imagen,
        });

        // Set image preview if available
        if (producto.imagen) {
          this.imagenPreview = producto.imagen;
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar el producto:', err);
        this.error = 'Error al cargar el producto';
        this.isLoading = false;
      }
    });
  }

  onImageChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Convert to base64 for preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result as string;
        this.productoForm.patchValue({
          imagen: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  }

  // Mètode per canviar entre pujar arxiu o utilitzar URL
  cambiarMetodoImagen(metodo: 'archivo' | 'url'): void {
    this.metodoImagen = metodo;
    
    // Netejar el camp que no s'utilitzarà
    if (metodo === 'archivo') {
      this.productoForm.get('imagen_url')?.setValue('');
    } else {
      this.productoForm.get('imagen')?.setValue('');
    }
    
    // Netejar la vista prèvia si canviem de mètode
    if (!this.isEditing) {
      this.imagenPreview = null;
    }
  }

  // Mètode per carregar la imatge des d'una URL
  cargarImagenDesdeUrl(): void {
    const url = this.productoForm.get('imagen_url')?.value;
    if (url && url.trim()) {
      this.imagenPreview = url;
      this.productoForm.patchValue({
        imagen: url // Guardem la URL al camp d'imatge per al backend
      });
    }
  }

  onSubmit(): void {
    if (this.productoForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.productoForm.controls).forEach(key => {
        this.productoForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    const productoData = { ...this.productoForm.value };
    
    // Si estem utilitzant URL, assegurem-nos que la imatge tingui el valor correcte
    if (this.metodoImagen === 'url' && productoData.imagen_url) {
      productoData.imagen = productoData.imagen_url;
    }
    
    // Eliminem el camp imagen_url ja que no el necessitem al backend
    delete productoData.imagen_url;

    // Asegurarse de que categorias es un array válido
    if (!Array.isArray(productoData.categorias) || productoData.categorias.length === 0) {
      productoData.categorias = [];
    }

    // Convertir valores numéricos
    if (productoData.precio) {
      productoData.precio = parseFloat(productoData.precio);
    }
    if (productoData.stock) {
      productoData.stock = parseInt(productoData.stock, 10);
    }
    if (productoData.precio_oferta) {
      productoData.precio_oferta = parseFloat(productoData.precio_oferta);
    }

    console.log('Datos a enviar:', productoData);

    if (this.isEditing && this.productoId) {
      // Update existing product
      this.vendedorService.actualizarProducto(this.productoId, productoData).subscribe({
        next: () => {
          this.isSubmitting = false;
          alert('Producto actualizado correctamente');
          this.router.navigate(['/vendedor/productos']);
        },
        error: (err) => {
          console.error('Error al actualizar el producto:', err);
          this.error = 'Error al actualizar el producto: ' + (err.error?.message || err.message || 'Error desconocido');
          this.isSubmitting = false;
        }
      });
    } else {
      // Create new product
      this.vendedorService.crearProducto(productoData).subscribe({
        next: () => {
          this.isSubmitting = false;
          alert('Producto creado correctamente');
          this.router.navigate(['/vendedor/productos']);
        },
        error: (err) => {
          console.error('Error al crear el producto:', err);
          this.error = 'Error al crear el producto: ' + (err.error?.message || err.message || 'Error desconocido');
          this.isSubmitting = false;
        }
      });
    }
  }

  // Helper method to check if a form control is invalid and touched
  isInvalid(controlName: string): boolean {
    const control = this.productoForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }

  // Añadir este método para manejar la selección de categorías
  toggleCategoria(categoriaId: number): void {
    const categoriasControl = this.productoForm.get('categorias');
    if (!categoriasControl) return;
    
    const currentValues = categoriasControl.value || [];
    
    if (currentValues.includes(categoriaId)) {
      // Si ya está seleccionada, la quitamos
      const newValues = currentValues.filter((id: number) => id !== categoriaId);
      categoriasControl.setValue(newValues);
    } else {
      // Si no está seleccionada, la añadimos
      const newValues = [...currentValues, categoriaId];
      categoriasControl.setValue(newValues);
    }
    
    // Añadir clase 'selected' al elemento seleccionado
    setTimeout(() => {
      const checkboxes = document.querySelectorAll('.categoria-option');
      checkboxes.forEach(checkbox => {
        const input = checkbox.querySelector('input') as HTMLInputElement;
        if (input && input.checked) {
          checkbox.classList.add('selected');
        } else {
          checkbox.classList.remove('selected');
        }
      });
    });
  }
}
