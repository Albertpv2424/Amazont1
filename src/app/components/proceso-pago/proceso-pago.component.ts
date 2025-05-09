import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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
  correoPaypal?: string;
  numeroCuenta?: string;
  entidadBancaria?: string;
  numeroCompleto?: string;
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
      fechaExpiracion: ['', [Validators.required, this.validarFechaExpiracion.bind(this)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      correoPaypal: ['', [Validators.email]],
      numeroCuenta: [''],
      entidadBancaria: [''],
      guardarMetodo: [true]
    });
  }

  cargarMetodosPago(): void {
    this.cargandoMetodosPago = true;
    this.errorCarga = '';
    
    // Obtener el usuario actual
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.metodosPago = [];
      this.cargandoMetodosPago = false;
      this.nuevoMetodoPago = true;
      return;
    }
    
    // Utilizar la clave específica del usuario
    const userKey = `metodosPago_${currentUser.email}`;
    const metodosGuardados = localStorage.getItem(userKey);
    
    console.log('Métodos guardados en localStorage:', metodosGuardados);
    
    if (metodosGuardados) {
      try {
        this.metodosPago = JSON.parse(metodosGuardados);
        console.log('Métodos de pago cargados:', this.metodosPago);
      } catch (error) {
        console.error('Error al parsear métodos de pago:', error);
        this.metodosPago = [];
      }
    } else {
      this.metodosPago = [];
    }
    
    this.cargandoMetodosPago = false;
    
    // Si no hay métodos de pago, mostrar el formulario para añadir uno nuevo
    if (this.metodosPago.length === 0) {
      this.nuevoMetodoPago = true;
    }
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
      
      // Eliminar espais de la targeta de crèdit
      if (this.p['numeroTarjeta'].value) {
        const numeroSinEspacios = this.p['numeroTarjeta'].value.replace(/\s/g, '');
        this.pagoForm.get('numeroTarjeta')?.setValue(numeroSinEspacios);
      }
      
      // Si està afegint un nou mètode de pagament, validar el formulari
      if (this.nuevoMetodoPago) {
        if (this.p['tipo'].value === 'credit_card') {
          if (!this.p['numeroTarjeta'].value || 
              !this.p['titular'].value || 
              !this.p['fechaExpiracion'].value || 
              !this.p['cvv'].value ||
              this.pagoForm.get('numeroTarjeta')?.invalid ||
              this.pagoForm.get('fechaExpiracion')?.invalid ||
              this.pagoForm.get('cvv')?.invalid) {
            return;
          }
        }
        if (this.p['tipo'].value === 'paypal') {
          if (!this.p['correoPaypal'].value || this.pagoForm.get('correoPaypal')?.invalid) {
            return;
          }
        }
        if (this.p['tipo'].value === 'bank_transfer') {
          if (!this.p['numeroCuenta'].value || 
              !this.p['entidadBancaria'].value) {
            return;
          }
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
    
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;
    
    // Crear nuevo método de pago con ID
    let nuevoMetodo: any = {
      id: Date.now(), // ID único simple
      tipo: this.p['tipo'].value
    };
    
    // Añadir propiedades específicas según el tipo de pago
    if (this.p['tipo'].value === 'credit_card') {
      nuevoMetodo.numero = this.ocultarNumeroTarjeta(this.p['numeroTarjeta'].value);
      nuevoMetodo.titular = this.p['titular'].value;
      nuevoMetodo.fechaExpiracion = this.p['fechaExpiracion'].value;
      nuevoMetodo.numeroCompleto = this.p['numeroTarjeta'].value; // Guardar para uso interno
    } else if (this.p['tipo'].value === 'paypal') {
      nuevoMetodo.correoPaypal = this.p['correoPaypal'].value;
    } else if (this.p['tipo'].value === 'bank_transfer') {
      nuevoMetodo.numeroCuenta = this.p['numeroCuenta'].value;
      nuevoMetodo.entidadBancaria = this.p['entidadBancaria'].value;
    }
    
    // Añadir a la lista
    this.metodosPago.push(nuevoMetodo);
    
    // Usar clave específica del usuario para los métodos de pago
    const userKey = `metodosPago_${currentUser.email}`;
    localStorage.setItem(userKey, JSON.stringify(this.metodosPago));
    
    console.log('Método de pago añadido:', nuevoMetodo);
    console.log('Métodos de pago actualizados:', this.metodosPago);
  }

  // Añadir método para ocultar el número de tarjeta
  ocultarNumeroTarjeta(numero: string): string {
    if (numero && numero.length >= 4) {
      return '**** **** **** ' + numero.slice(-4);
    }
    return numero;
  }

  cancelarCompra(): void {
    this.router.navigate(['/carrito']);
  }


  // Añadir este método para validar la fecha de expiración
  validarFechaExpiracion(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    
    const fechaIngresada = control.value;
    
    // Verificar formato MM/YY
    if (!/^\d{2}\/\d{2}$/.test(fechaIngresada)) {
      return { formatoInvalido: true };
    }
    
    const [mes, año] = fechaIngresada.split('/');
    const mesNum = parseInt(mes, 10);
    const añoNum = parseInt(año, 10) + 2000; // Convertir a año de 4 dígitos (20XX)
    
    // Validar que el mes esté entre 1 y 12
    if (mesNum < 1 || mesNum > 12) {
      return { mesInvalido: true };
    }
    
    // Obtener fecha actual
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1; // getMonth() devuelve 0-11
    const añoActual = fechaActual.getFullYear();
    
    // Comprobar si la tarjeta ha caducado
    if (añoNum < añoActual || (añoNum === añoActual && mesNum < mesActual)) {
      return { tarjetaCaducada: true };
    }
    
    return null;
  }

  seleccionarMetodoPago(metodo: MetodoPago): void {
    this.pagoForm.get('metodoPagoId')?.setValue(metodo.id);
    this.pagoForm.get('tipo')?.setValue(metodo.tipo);
    
    // Dependiendo del tipo de método, establecer los valores correspondientes
    if (metodo.tipo === 'credit_card' && metodo.numeroCompleto) {
      this.pagoForm.get('numeroTarjeta')?.setValue(metodo.numeroCompleto);
      this.pagoForm.get('titular')?.setValue(metodo.titular);
      this.pagoForm.get('fechaExpiracion')?.setValue(metodo.fechaExpiracion);
      // No establecemos el CVV por seguridad, el usuario debe ingresarlo
    } else if (metodo.tipo === 'paypal') {
      this.pagoForm.get('correoPaypal')?.setValue(metodo.correoPaypal);
    } else if (metodo.tipo === 'bank_transfer') {
      this.pagoForm.get('numeroCuenta')?.setValue(metodo.numeroCuenta);
      this.pagoForm.get('entidadBancaria')?.setValue(metodo.entidadBancaria);
    }
  }
}
