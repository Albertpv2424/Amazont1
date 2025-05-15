import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VendedorService } from '../../../services/vendedor.service';

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

  constructor(
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
  }

  initForm(): void {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0.01)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      en_oferta: [false],
      precio_oferta: [''],
      imagen: [''],
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
        this.categorias = data;
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

  onSubmit(): void {
    if (this.productoForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.productoForm.controls).forEach(key => {
        this.productoForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    const productoData = this.productoForm.value;

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
          this.error = 'Error al actualizar el producto';
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
          this.error = 'Error al crear el producto';
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
}
