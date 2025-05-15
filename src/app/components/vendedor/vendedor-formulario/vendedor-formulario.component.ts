import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { VendedorService } from '../../../services/vendedor.service';  // Fix path
import { Producto } from '../../../interfaces/producto.interface';  // Fix path
import { ThemeService } from '../../../services/theme.service';  // Fix path

@Component({
  selector: 'app-vendedor-formulario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vendedor-formulario.component.html',
  styleUrls: ['./vendedor-formulario.component.css']
})
export class VendedorFormularioComponent implements OnInit {
  @Input() producto: Producto | null = null;
  @Input() modoEdicion = false;
  @Output() productoGuardado = new EventEmitter<void>();

  productoForm!: FormGroup;
  categorias: any[] = [];
  cargandoCategorias = false;
  guardando = false;
  error = '';
  isDarkMode = false;
  imagenPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private vendedorService: VendedorService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarCategorias();

    this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
  }

  inicializarFormulario(): void {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0.01)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      imagen: ['', Validators.required],
      categorias: [[], Validators.required],
      en_oferta: [false],
      precio_oferta: [{ value: '', disabled: true }]
    });

    // Si estamos en modo edición, rellenamos el formulario con los datos del producto
    if (this.modoEdicion && this.producto) {
      this.productoForm.patchValue({
        nombre: this.producto.nombre || this.producto.titulo,
        descripcion: this.producto.descripcion,
        precio: this.producto.precio,
        stock: this.producto.stock,
        imagen: this.producto.imagen,
        en_oferta: this.producto.descuento ? true : false,
        precio_oferta: this.producto.descuento ? this.calcularPrecioOferta(this.producto.precio!, this.producto.descuento) : ''
      });

      // Mostrar la imagen actual
      this.imagenPreview = this.producto.imagen;
    }

    // Escuchar cambios en el checkbox de oferta
    this.productoForm.get('en_oferta')?.valueChanges.subscribe(value => {
      const precioOfertaControl = this.productoForm.get('precio_oferta');
      if (value) {
        precioOfertaControl?.enable();
        precioOfertaControl?.setValidators([Validators.required, Validators.min(0.01)]);
      } else {
        precioOfertaControl?.disable();
        precioOfertaControl?.clearValidators();
      }
      precioOfertaControl?.updateValueAndValidity();
    });
  }

  cargarCategorias(): void {
    this.cargandoCategorias = true;
    this.vendedorService.getCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.cargandoCategorias = false;

        // Si estamos en modo edición, seleccionamos las categorías del producto
        if (this.modoEdicion && this.producto && this.producto.categoria) {
          // Aquí asumimos que producto.categoria es un string con el nombre de la categoría
          // En un caso real, probablemente tendrías un array de IDs de categorías
          const categoriaId = this.categorias.find(c => c.nombre === this.producto?.categoria)?.id_cat;
          if (categoriaId) {
            this.productoForm.patchValue({ categorias: [categoriaId] });
          }
        }
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.cargandoCategorias = false;
      }
    });
  }

  onImagenChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Aquí podrías implementar la lógica para subir la imagen a un servidor
      // Por ahora, simplemente mostramos una vista previa
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagenPreview = e.target?.result as string;
        this.productoForm.patchValue({ imagen: this.imagenPreview });
      };
      reader.readAsDataURL(file);
    }
  }

  guardarProducto(): void {
    if (this.productoForm.invalid) {
      // Marcar todos los campos como tocados para mostrar los errores
      Object.keys(this.productoForm.controls).forEach(key => {
        const control = this.productoForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.guardando = true;
    this.error = '';

    const productoData = this.prepararDatosProducto();

    if (this.modoEdicion && this.producto?.id) {
      // Actualizar producto existente
      this.vendedorService.actualizarProducto(this.producto.id, productoData).subscribe({
        next: () => {
          this.guardando = false;
          this.productoGuardado.emit();
        },
        error: (err) => {
          console.error('Error updating product:', err);
          this.error = 'Error al actualizar el producto. Por favor, inténtalo de nuevo.';
          this.guardando = false;
        }
      });
    } else {
      // Crear nuevo producto
      this.vendedorService.crearProducto(productoData).subscribe({
        next: () => {
          this.guardando = false;
          this.productoGuardado.emit();
        },
        error: (err) => {
          console.error('Error creating product:', err);
          this.error = 'Error al crear el producto. Por favor, inténtalo de nuevo.';
          this.guardando = false;
        }
      });
    }
  }

  prepararDatosProducto(): any {
    const formValue = this.productoForm.value;
    const productoData: any = {
      nombre: formValue.nombre,
      descripcion: formValue.descripcion,
      precio: formValue.precio,
      stock: formValue.stock,
      imagen: formValue.imagen,
      categorias: formValue.categorias
    };

    if (formValue.en_oferta) {
      productoData.en_oferta = true;
      productoData.precio_oferta = formValue.precio_oferta;
    } else {
      productoData.en_oferta = false;
      productoData.precio_oferta = null;
    }
    
    return productoData;
  }
  
  calcularPrecioOferta(precio: number, descuento: string): number {
    // Eliminar el símbolo % si existe
    const descuentoNumerico = parseFloat(descuento.replace('%', ''));
    
    // Calcular el precio con descuento
    if (!isNaN(descuentoNumerico) && descuentoNumerico > 0) {
      return precio * (1 - (descuentoNumerico / 100));
    }
    
    return precio;
  }
  
  cancelar(): void {
    this.productoGuardado.emit();
  }
}