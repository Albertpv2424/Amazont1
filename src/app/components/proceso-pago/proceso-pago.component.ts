import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { CarritoService, ProductoCarrito } from '../../services/carrito.service';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface DireccionEnvio {
  calle: string;
  ciudad: string;
  codigoPostal: string;
  pais: string;
}

interface MetodoPago {
  id?: number;
  tipo: string;
  numero?: string;
  titular?: string;
  fechaExpiracion?: string;
  isDefault?: boolean;
}

@Component({
  selector: 'app-proceso-pago',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './proceso-pago.component.html',
  styleUrls: ['./proceso-pago.component.css']
})
export class ProcesoPagoComponent implements OnInit {
  isDarkMode = false;
  direccionForm!: FormGroup;
  pagoForm!: FormGroup;
  productosCarrito: ProductoCarrito[] = [];
  subtotal: number = 0;
  envio: number = 0;
  total: number = 0;
  submitted = false;
  pagoSubmitted = false;
  metodosPago: MetodoPago[] = [];
  nuevoMetodoPago = false;
  cargandoMetodosPago = true;
  errorCarga = '';
  pasoActual = 1; // 1: Dirección, 2: Método de pago, 3: Resumen

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private carritoService: CarritoService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Inicializar formularios
    this.inicializarFormularios();
    
    // Suscribirse al tema
    this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
    
    // Obtener productos del carrito
    this.carritoService.getCarrito().subscribe(productos => {
      this.productosCarrito = productos;
      this.actualizarTotales();
    });
    
    // Cargar métodos de pago del usuario
    this.cargarMetodosPago();
  }

  inicializarFormularios(): void {
    this.direccionForm = this.formBuilder.group({
      calle: ['', [Validators.required, Validators.minLength(5)]],
      ciudad: ['', [Validators.required]],
      codigoPostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      pais: ['España', [Validators.required]]
    });

    this.pagoForm = this.formBuilder.group({
      metodoPagoId: [0],
      tipo: ['credit_card'],
      numeroTarjeta: ['', [Validators.pattern(/^\d{16}$/)]],
      titular: [''],
      fechaExpiracion: [''],
      correoPaypal: ['', [Validators.email]],
      numeroCuenta: [''],
      entidadBancaria: [''],
      guardarMetodo: [true]
    });
  }

  cargarMetodosPago(): void {
    this.cargandoMetodosPago = true;
    this.errorCarga = '';
    
    // For now, since we're ignoring the Laravel backend, let's simulate an empty payment methods list
    setTimeout(() => {
      this.metodosPago = [];
      this.cargandoMetodosPago = false;
      
      // If no payment methods, show the form to add a new one
      if (this.metodosPago.length === 0) {
        this.nuevoMetodoPago = true;
      }
    }, 500);
  }

  get f() { return this.direccionForm.controls; }
  get p() { return this.pagoForm.controls; }

  actualizarTotales(): void {
    this.subtotal = this.carritoService.obtenerTotal();
    this.envio = this.carritoService.calcularEnvio();
    this.total = this.subtotal + this.envio;
  }

  mostrarNuevoMetodoPago(): void {
    this.nuevoMetodoPago = true;
  }

  ocultarNuevoMetodoPago(): void {
    this.nuevoMetodoPago = false;
  }

  siguientePaso(): void {
    if (this.pasoActual === 1) {
      this.submitted = true;
      if (this.direccionForm.invalid) {
        return;
      }
      this.pasoActual = 2;
    } else if (this.pasoActual === 2) {
      this.pagoSubmitted = true;
      
      // Si está añadiendo un nuevo método de pago, validar el formulario
      if (this.nuevoMetodoPago) {
        if (this.p['tipo'].value === 'credit_card' && 
            (!this.p['numeroTarjeta'].value || !this.p['titular'].value || !this.p['fechaExpiracion'].value)) {
          return;
        }
        if (this.p['tipo'].value === 'paypal' && !this.p['correoPaypal'].value) {
          return;
        }
        if (this.p['tipo'].value === 'bank_transfer' && 
            (!this.p['numeroCuenta'].value || !this.p['entidadBancaria'].value)) {
          return;
        }
      } else if (!this.p['metodoPagoId'].value && this.metodosPago.length > 0) {
        return;
      }
      
      this.pasoActual = 3;
    }
  }

  pasoAnterior(): void {
    if (this.pasoActual > 1) {
      this.pasoActual--;
    }
  }

  confirmarCompra(): void {
    // Guardar nuevo método de pago si es necesario
    if (this.nuevoMetodoPago && this.p['guardarMetodo'].value) {
      this.guardarMetodoPago();
    }
    
    // Guardar el total antes de vaciar el carrito
    const totalCompra = this.total;
    
    // Hacer una copia de los productos para reducir stock
    const productosParaReducirStock = [...this.productosCarrito];
    
    // Vaciar el carrito en localStorage y en el servicio
    localStorage.removeItem('carrito');
    this.carritoService.vaciarCarrito();
    
    // Navegar a la página de confirmación
    this.router.navigate(['/confirmacion-compra'], { 
      queryParams: { 
        success: true,
        total: totalCompra
      } 
    });
  }

  guardarMetodoPago(): void {
    if (!this.authService.isLoggedIn()) {
      return;
    }
    
    // Get token from localStorage instead of using a non-existent method
    const token = localStorage.getItem('token');
    const metodoPago = {
      tipo: this.p['tipo'].value,
      card_number: this.p['numeroTarjeta'].value,
      card_holder_name: this.p['titular'].value,
      expiration_date: this.p['fechaExpiracion'].value,
      is_default: true
    };
    
    this.http.post(`${environment.apiUrl}/payment-methods`, metodoPago, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).subscribe({
      next: (response: any) => {
        console.log('Método de pago guardado:', response);
      },
      error: (error) => {
        console.error('Error al guardar método de pago:', error);
      }
    });
  }

  cancelarCompra(): void {
    this.router.navigate(['/carrito']);
  }
}
