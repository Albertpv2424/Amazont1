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
  metodoPagoSeleccionado: MetodoPago | null = null;

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
    
    // Cargar datos del perfil del usuario para la dirección
    this.cargarDireccionUsuario();
    
    // Cargar método de pago seleccionado del localStorage si existe
    const metodoPagoGuardado = localStorage.getItem('metodoPagoSeleccionado');
    if (metodoPagoGuardado) {
      try {
        this.metodoPagoSeleccionado = JSON.parse(metodoPagoGuardado);
        console.log('Método de pago cargado desde localStorage:', this.metodoPagoSeleccionado);
      } catch (error) {
        console.error('Error al parsear método de pago desde localStorage:', error);
      }
    }
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
      // Obtenir el token d'autenticació
  const token = localStorage.getItem('auth_token');
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  
  // Mostrar indicador de càrrega
  this.cargandoMetodosPago = true;
  this.errorCarga = '';
  
  // Fer la petició al backend per obtenir els mètodes de pagament
  this.http.get('http://localhost:8000/api/payment-methods', { headers }).subscribe({
    next: (response: any) => {
      console.log('Mètodes de pagament carregats des de l\'API:', response);
      
      if (response.status === 'success' && response.payment_methods) {
        // Transformar els mètodes de pagament al format que utilitza el component
        this.metodosPago = response.payment_methods.map((pm: any) => ({
          id: pm.id,
          tipo: pm.tipo,
          numero: pm.tipo === 'credit_card' ? this.ocultarNumeroTarjeta(pm.num_tarjeta || '') : undefined,
          titular: pm.nombre,
          fechaExpiracion: pm.fecha_caducidad,
          correoPaypal: pm.email_paypal,
          numeroCuenta: pm.iban,
          entidadBancaria: pm.entidad_bancaria,
          numeroCompleto: pm.num_tarjeta
        }));
        
        // Mostrar els mètodes de pagament
        this.nuevoMetodoPago = this.metodosPago.length === 0;
        console.log('Mètodes de pagament transformats:', this.metodosPago);
      } else {
        this.metodosPago = [];
        this.nuevoMetodoPago = true;
      }
      
      this.cargandoMetodosPago = false;
    },
    error: (error) => {
      console.error('Error al carregar mètodes de pagament des de l\'API:', error);
      this.errorCarga = 'Error al carregar mètodes de pagament';
      this.metodosPago = [];
      this.nuevoMetodoPago = true;
      this.cargandoMetodosPago = false;
      
      // Si hi ha un error d'autenticació, redirigir a la pàgina de login
      if (error.status === 401) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    }
  });
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
          
          // Guardar el método de pago seleccionado (tarjeta)
          this.metodoPagoSeleccionado = {
            tipo: 'credit_card',
            numero: this.ocultarNumeroTarjeta(this.p['numeroTarjeta'].value),
            titular: this.p['titular'].value,
            fechaExpiracion: this.p['fechaExpiracion'].value,
            numeroCompleto: this.p['numeroTarjeta'].value
          };
          
          // Guardar el método de pago si está marcada la opción
          if (this.p['guardarMetodo'].value) {
            this.guardarMetodoPago();
          }
          
          // Guardar el método de pago seleccionado en localStorage para el paso 3
          localStorage.setItem('metodoPagoSeleccionado', JSON.stringify(this.metodoPagoSeleccionado));
        }
        if (this.p['tipo'].value === 'paypal') {
          if (!this.p['correoPaypal'].value || this.pagoForm.get('correoPaypal')?.invalid) {
            return;
          }
          
          // Guardar el método de pago seleccionado (PayPal)
          this.metodoPagoSeleccionado = {
            tipo: 'paypal',
            correoPaypal: this.p['correoPaypal'].value
          };
          
          // Guardar el método de pago si está marcada la opción
          if (this.p['guardarMetodo'].value) {
            this.guardarMetodoPago();
          }
        }
        if (this.p['tipo'].value === 'bank_transfer') {
          if (!this.p['numeroCuenta'].value || 
              !this.p['entidadBancaria'].value) {
            return;
          }
          
          // Guardar el método de pago seleccionado (transferencia)
          this.metodoPagoSeleccionado = {
            tipo: 'bank_transfer',
            numeroCuenta: this.p['numeroCuenta'].value,
            entidadBancaria: this.p['entidadBancaria'].value
          };
          
          // Guardar el método de pago si está marcada la opción
          if (this.p['guardarMetodo'].value) {
            this.guardarMetodoPago();
          }
          
          // Guardar el ID del método de pago seleccionado
          localStorage.setItem('metodoPagoId', this.metodoPagoSeleccionado.id?.toString() || '0');
        }
      } else if (this.p['metodoPagoId'].value) {
        // Si ha seleccionado un método de pago existente
        const metodoPagoId = this.p['metodoPagoId'].value;
        this.metodoPagoSeleccionado = this.metodosPago.find(m => m.id === metodoPagoId) || null;
        
        // Guardar el método de pago seleccionado en localStorage para el paso 3
        if (this.metodoPagoSeleccionado) {
          localStorage.setItem('metodoPagoSeleccionado', JSON.stringify(this.metodoPagoSeleccionado));
          // Guardar el ID del método de pago seleccionado
          localStorage.setItem('metodoPagoId', metodoPagoId.toString());
        }
      } else if (this.metodosPago.length > 0) {
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
    // Obtenir l'ID del mètode de pagament seleccionat
    const metodoPagoId = localStorage.getItem('metodoPagoId');
    
    if (!metodoPagoId) {
      console.error('No s\'ha seleccionat cap mètode de pagament');
      return;
    }
    
    // Obtenir el token d'autenticació
    const token = localStorage.getItem('auth_token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // Preparar les dades per a la petició
    const checkoutData = {
      payment_method_id: parseInt(metodoPagoId)
    };
    
    // Fer la petició al backend per finalitzar la compra
    this.http.post('http://localhost:8000/api/cart/checkout', checkoutData, { headers }).subscribe({
      next: (response: any) => {
        console.log('Compra confirmada:', response);
        
        // Guardar el total abans de buidar el carret
        const totalCompra = this.total;
        
        // Buidar el carret a localStorage i al servei
        localStorage.removeItem('carrito');
        this.carritoService.vaciarCarrito();
        
        // Navegar a la pàgina de confirmació
        this.router.navigate(['/confirmacion-compra'], { 
          queryParams: { 
            success: true,
            total: totalCompra
          } 
        });
      },
      error: (error) => {
        console.error('Error al confirmar la compra:', error);
        alert('Hi ha hagut un error al confirmar la compra. Si us plau, torna-ho a provar més tard.');
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
    
    // Guardar el método seleccionado
    this.metodoPagoSeleccionado = metodo;
  }



  cargarDireccionUsuario(): void {
    // Obtenir l'usuari actual
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return;
    }
    
    // Obtenir el token d'autenticació
    const token = localStorage.getItem('auth_token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // Fer la petició al backend per obtenir el perfil complet
    this.http.get('http://localhost:8000/api/user', { headers }).subscribe({
      next: (response: any) => {
        console.log('Perfil d\'usuari carregat:', response);
        
        if (response.status === 'success' && response.user) {
          const user = response.user;
          
          // Emplenar el formulari amb les dades de l'usuari
          this.direccionForm.patchValue({
            calle: user.direccion || '',
            ciudad: user.ciudad || '',
            codigoPostal: user.codigo_postal || '',
            pais: user.pais || 'España'
          });
          
          console.log('Formulari de direcció emplenat amb dades del perfil');
        }
      },
      error: (error) => {
        console.error('Error al carregar el perfil d\'usuari:', error);
      }
    });
  }

  // Método para obtener el texto descriptivo del método de pago seleccionado
  getDescripcionMetodoPago(): string {
    if (!this.metodoPagoSeleccionado) {
      return 'No seleccionado';
    }
    
    switch (this.metodoPagoSeleccionado.tipo) {
      case 'credit_card':
        return `Targeta ${this.metodoPagoSeleccionado.numero || ''} - ${this.metodoPagoSeleccionado.titular || ''}`;
      case 'paypal':
        return `PayPal - ${this.metodoPagoSeleccionado.correoPaypal || ''}`;
      case 'bank_transfer':
        return `Transferència bancària - ${this.metodoPagoSeleccionado.entidadBancaria || ''} - ${this.metodoPagoSeleccionado.numeroCuenta || ''}`;
      default:
        return 'Mètode de pagament desconegut';
    }
  }


// Afegim un mètode per obtenir l'ID del mètode de pagament seleccionat
getMetodoPagoId(): string {
  const metodoPagoId = localStorage.getItem('metodoPagoId');
  return metodoPagoId || 'No seleccionat';
}


// Afegim un mètode per obtenir el tipus de mètode de pagament
getTipoMetodoPago(): string {
  if (!this.metodoPagoSeleccionado) {
    return 'No seleccionat';
  }
  
  switch (this.metodoPagoSeleccionado.tipo) {
    case 'credit_card':
      return 'Targeta de crèdit';
    case 'paypal':
      return 'PayPal';
    case 'bank_transfer':
      return 'Transferència bancària';
    default:
      return 'Mètode de pagament desconegut';
  }
}


// Afegim un nou mètode per gestionar el clic al botó "Usar otro método de pago"
usarOtroMetodoPago(): void {
this.router.navigate(['/perfil-usuario']);
}
}