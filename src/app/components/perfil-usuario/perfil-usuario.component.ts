import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { PedidoService } from '../../services/pedido.service';
import { Pedido } from '../../models/pedido.model';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {
  perfilForm!: FormGroup;
  metodoPagoForm!: FormGroup;
  pagoForm!: FormGroup;
  passwordForm!: FormGroup; // Nuevo formulario para cambiar la contraseña
  submitted = false;
  metodoPagoSubmitted = false;
  pagoSubmitted = false;
  passwordSubmitted = false; // Nuevo flag para controlar el envío del formulario
  isDarkMode = false;
  activeTab = 0;
  mostrarFormMetodoPago = false;
  mostrarFormPassword = false; // Nuevo flag para mostrar/ocultar el formulario
  tabSeleccionado = 0;
  nuevoMetodoPago = false;
  cargandoMetodosPago = false;
  errorCarga = '';
  passwordError = ''; // Para mostrar errores
  passwordSuccess = ''; // Para mostrar mensajes de éxito

  metodosPago: any[] = [];
  pedidos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private themeService: ThemeService,
    private authService: AuthService,
    private pedidoService: PedidoService,
    private http: HttpClient  // Add this line
  ) {}

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern(/^[0-9]{9}$/)]],
      ciudad: [''],
      pais: ['']
    });

    this.metodoPagoForm = this.fb.group({
      tipo: ['Tarjeta', Validators.required],
      numero: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      titular: ['', Validators.required],
      fechaExpiracion: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      correoPaypal: ['', [Validators.email]],
      numeroCuenta: [''],
      entidadBancaria: ['']
    });

    this.pagoForm = this.fb.group({
      metodoPagoId: [0],
      tipo: ['credit_card'],
      numeroTarjeta: ['', [Validators.pattern(/^\d{16}$/)]],
      titular: [''],
      fechaExpiracion: [''],
      cvv: ['', [Validators.pattern(/^\d{3,4}$/)]],
      correoPaypal: ['', [Validators.email]],
      numeroCuenta: ['', [Validators.minLength(15)]],
      entidadBancaria: [''],
      guardarMetodo: [true]
    });

    // Load user data from AuthService instead of hardcoded values
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.perfilForm.patchValue({
        nombre: currentUser.nombre || '',
        email: currentUser.email || '',
        telefono: currentUser.telefono || '',
        ciudad: currentUser.ciudad || '',
        pais: currentUser.pais || ''
      });
    }

    this.cargarMetodosPago();

    this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );

    this.pedidos = [];
    
    // Inicializar el formulario de cambio de contraseña
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
    this.cargarPedidos();
    this.crearPedidoFals(); // Afegir aquesta línea per crear un pedido fals
  }

  crearPedidoFals(): void {
    const pedidoFals = {
      id: Date.now(),
      fecha: new Date().toISOString(),
      total: 100.00,
      productos: [
        { nombre: 'Producte Fals 1', cantidad: 1, precio: 50.00 },
        { nombre: 'Producte Fals 2', cantidad: 2, precio: 25.00 }
      ]
    };
    this.pedidos.push(pedidoFals);
    console.log('Pedido fals creat:', pedidoFals);
  }

  get p() { 
    return this.pagoForm.controls; 
  }

  get f() { 
    return this.perfilForm.controls; 
  }

  get mp() {
    return this.metodoPagoForm.controls; 
  }

  cambiarTab(index: number): void {
    this.tabSeleccionado = index;
  }

  mostrarNuevoMetodoPago(): void {
    this.nuevoMetodoPago = true;
  }

  cargarMetodosPago(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.metodosPago = [];
      return;
    }
    
    this.cargandoMetodosPago = true;
    this.errorCarga = '';
    
    // Obtenir el token d'autenticació
    const token = localStorage.getItem('auth_token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // Fer la petició al backend
    this.http.get('http://localhost:8000/api/payment-methods', { headers }).subscribe({
      next: (response: any) => {
        console.log('Mètodes de pagament carregats:', response);
        
        if (response.status === 'success' && response.payment_methods) {
          // Transformar els mètodes de pagament al format que utilitza el component
          this.metodosPago = response.payment_methods.map((pm: any) => this.transformarMetodoPago(pm));
        } else {
          this.metodosPago = [];
        }
        
        this.cargandoMetodosPago = false;
      },
      error: (error) => {
        console.error('Error al carregar mètodes de pagament:', error);
        this.errorCarga = 'Error al carregar mètodes de pagament';
        this.metodosPago = [];
        this.cargandoMetodosPago = false;
      }
    });
  }

  agregarMetodoPago(): void {
    this.metodoPagoSubmitted = true;
    
    if (this.metodoPagoForm.valid) {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) return;
      
      // Preparar les dades segons el tipus de pagament
      let paymentData: any = {
        tipo: this.metodoPagoForm.value.tipo.toLowerCase()
      };
      
      if (this.metodoPagoForm.value.tipo === 'Tarjeta') {
        paymentData.tipo = 'targeta';
        paymentData.num_tarjeta = this.metodoPagoForm.value.numero;
        paymentData.nombre = this.metodoPagoForm.value.titular;
        paymentData.fecha_caducidad = this.metodoPagoForm.value.fechaExpiracion;
        paymentData.cvv = '123'; // Valor per defecte o es podria afegir al formulari
      } else if (this.metodoPagoForm.value.tipo === 'PayPal') {
        paymentData.tipo = 'paypal';
        paymentData.email_paypal = this.metodoPagoForm.value.correoPaypal;
      } else if (this.metodoPagoForm.value.tipo === 'Transferencia') {
        paymentData.tipo = 'transferencia';
        paymentData.iban = this.metodoPagoForm.value.numeroCuenta;
        paymentData.bank_name = this.metodoPagoForm.value.entidadBancaria;
      }
      
      // Obtenir el token d'autenticació
      const token = localStorage.getItem('auth_token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      // Enviar la petició al backend
      this.http.post('http://localhost:8000/api/user/metodopago', paymentData, { headers }).subscribe({
        next: (response: any) => {
          console.log('Mètode de pagament afegit:', response);
          
          // Afegir el nou mètode a la llista local
          if (response.status === 'success' && response.payment_method) {
            const nuevoMetodo = this.transformarMetodoPago(response.payment_method);
            this.metodosPago.push(nuevoMetodo);
          }
          
          // Ocultar el formulari i mostrar missatge d'èxit
          this.ocultarFormularioMetodoPago();
          alert('Mètode de pagament afegit correctament');
          
          // Recarregar els mètodes de pagament
          this.cargarMetodosPago();
        },
        error: (error) => {
          console.error('Error al afegir mètode de pagament:', error);
          let errorMsg = 'Error al afegir mètode de pagament';
          
          if (error.error && error.error.errors) {
            errorMsg += ': ' + Object.values(error.error.errors).join(', ');
          }
          
          alert(errorMsg);
        }
      });
    }
  }

  // Nou mètode per transformar la resposta del backend al format que utilitza el component
  transformarMetodoPago(paymentMethod: any): any {
    let metodo: any = {
      id: paymentMethod.id,
      tipo: this.capitalizarPrimeraLetra(paymentMethod.tipo)
    };
    
    if (paymentMethod.tipo === 'targeta') {
      metodo.numero = this.ocultarNumeroTarjeta(paymentMethod.numero_tarjeta || '');
      metodo.titular = paymentMethod.nombre_titular;
      metodo.fechaExpiracion = paymentMethod.fecha_expiracion;
    } else if (paymentMethod.tipo === 'paypal') {
      metodo.correoPaypal = paymentMethod.email_paypal;
    } else if (paymentMethod.tipo === 'transferencia') {
      metodo.numeroCuenta = paymentMethod.iban;
      metodo.entidadBancaria = paymentMethod.nombre_banco;
    }
    
    return metodo;
  }

  // Mètode auxiliar per capitalitzar la primera lletra
  capitalizarPrimeraLetra(texto: string): string {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  eliminarMetodoPago(index: number): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;
    
    const metodoPago = this.metodosPago[index];
    
    if (confirm('Estàs segur que vols eliminar aquest mètode de pagament?')) {
      // Obtenir el token d'autenticació
      const token = localStorage.getItem('auth_token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      // Fer la petició al backend
      this.http.delete(`http://localhost:8000/api/user/metodopago/${metodoPago.id}`, { headers }).subscribe({
        next: (response: any) => {
          console.log('Mètode de pagament eliminat:', response);
          
          // Eliminar el mètode de la llista local
          this.metodosPago.splice(index, 1);
          
          alert('Mètode de pagament eliminat correctament');
        },
        error: (error) => {
          console.error('Error al eliminar mètode de pagament:', error);
          alert('Error al eliminar mètode de pagament');
        }
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.perfilForm.valid) {
        const currentUser = this.authService.getCurrentUser();
        
        if (currentUser) {
            const token = localStorage.getItem('auth_token');
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            // Correct request body structure
            const requestBody = {
                ciudad: this.perfilForm.value.ciudad,
                pais: this.perfilForm.value.pais,
                telefono: this.perfilForm.value.telefono,
            };
            
            // Add error details logging
            this.http.put('http://localhost:8000/api/user/shipping-address', requestBody, { headers }).subscribe({
                next: (response: any) => {
                    alert('Perfil actualizado correctamente');
                    const updatedUser = {
                        ...currentUser,
                        ...requestBody
                    };
                    this.authService.updateCurrentUser(updatedUser);
                },
                error: (err: any) => {
                    console.error('Error details:', err.error.errors); // Log validation errors
                    alert('Error al actualizar el perfil: ' + (err.error.errors || err.message));
                }
            });
        }
    }
}

  mostrarFormularioMetodoPago(): void {
    this.mostrarFormMetodoPago = true;
    this.metodoPagoForm.reset({
      tipo: 'Tarjeta'
    });
  }

  ocultarFormularioMetodoPago(): void {
    this.mostrarFormMetodoPago = false;
    this.metodoPagoSubmitted = false;
  }

  onTipoPagoChange(event: any): void {
    const tipoPago = event.target.value;
    this.metodoPagoForm.get('tipo')?.setValue(tipoPago);
    
    // Reset validation based on payment type
    if (tipoPago === 'Tarjeta') {
      this.metodoPagoForm.get('numero')?.setValidators([Validators.required, Validators.pattern(/^\d{16}$/)]);
      this.metodoPagoForm.get('titular')?.setValidators([Validators.required]);
      this.metodoPagoForm.get('fechaExpiracion')?.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]);
      this.metodoPagoForm.get('correoPaypal')?.clearValidators();
      this.metodoPagoForm.get('numeroCuenta')?.clearValidators();
      this.metodoPagoForm.get('entidadBancaria')?.clearValidators();
    } else if (tipoPago === 'PayPal') {
      this.metodoPagoForm.get('correoPaypal')?.setValidators([Validators.required, Validators.email]);
      this.metodoPagoForm.get('numero')?.clearValidators();
      this.metodoPagoForm.get('titular')?.clearValidators();
      this.metodoPagoForm.get('fechaExpiracion')?.clearValidators();
      this.metodoPagoForm.get('numeroCuenta')?.clearValidators();
      this.metodoPagoForm.get('entidadBancaria')?.clearValidators();
    } else if (tipoPago === 'Transferencia') {
      this.metodoPagoForm.get('numeroCuenta')?.setValidators([Validators.required]);
      this.metodoPagoForm.get('entidadBancaria')?.setValidators([Validators.required]);
      this.metodoPagoForm.get('numero')?.clearValidators();
      this.metodoPagoForm.get('titular')?.clearValidators();
      this.metodoPagoForm.get('fechaExpiracion')?.clearValidators();
      this.metodoPagoForm.get('correoPaypal')?.clearValidators();
    }
    
    // Update form controls validation status
    this.metodoPagoForm.get('numero')?.updateValueAndValidity();
    this.metodoPagoForm.get('titular')?.updateValueAndValidity();
    this.metodoPagoForm.get('fechaExpiracion')?.updateValueAndValidity();
    this.metodoPagoForm.get('correoPaypal')?.updateValueAndValidity();
    this.metodoPagoForm.get('numeroCuenta')?.updateValueAndValidity();
    this.metodoPagoForm.get('entidadBancaria')?.updateValueAndValidity();
  }

  ocultarNumeroTarjeta(numero: string): string {
    if (numero && numero.length >= 4) {
      return '**** **** **** ' + numero.slice(-4);
    }
    return numero;
  }

  // Validador para comprobar que las contraseñas coinciden
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      const confirmPasswordControl = control.get('confirmPassword');
      if (confirmPasswordControl?.errors) {
        const errors = { ...confirmPasswordControl.errors };
        delete errors['passwordMismatch'];
        
        confirmPasswordControl.setErrors(Object.keys(errors).length ? errors : null);
      }
      return null;
    }
  }
  
  // Getter per accedir als controls del formulari
  get p_form() { 
    return this.passwordForm.controls; 
  }
  
  // Mostrar el formulari de canvi de contrasenya
  mostrarFormularioPassword(): void {
    this.mostrarFormPassword = true;
    this.passwordForm.reset();
    this.passwordError = '';
    this.passwordSuccess = '';
  }
  
  // Ocultar el formulari de canvi de contrasenya
  ocultarFormularioPassword(): void {
    this.mostrarFormPassword = false;
    this.passwordSubmitted = false;
  }
  
  // Mètode per canviar la contrasenya
  cambiarPassword(): void {
    this.passwordSubmitted = true;
    this.passwordError = '';
    this.passwordSuccess = '';
    
    if (this.passwordForm.valid) {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) return;
      
      // Obtenir els usuaris del localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.email === currentUser.email);
      
      if (userIndex === -1) {
        this.passwordError = 'No s\'ha trobat l\'usuari al sistema';
        return;
      }
      
      // Verificar la contrasenya actual
      if (users[userIndex].password !== this.passwordForm.value.currentPassword) {
        this.passwordError = 'La contrasenya actual no és correcta';
        return;
      }
      
      // Actualitzar la contrasenya
      users[userIndex].password = this.passwordForm.value.newPassword;
      localStorage.setItem('users', JSON.stringify(users));
      
      // Actualitzar l'usuari actual
      const updatedUser = { ...currentUser, password: this.passwordForm.value.newPassword };
      this.authService.updateCurrentUser(updatedUser);
      
      this.passwordSuccess = 'Contrasenya actualitzada correctament';
      this.passwordSubmitted = false;
      this.passwordForm.reset();
      
      // Ocultar el formulari després d'uns segons
      setTimeout(() => {
        this.ocultarFormularioPassword();
      }, 3000);
    }
  }

  cargarPedidos(): void {
    // Obtener los pedidos del servicio
    this.pedidos = this.pedidoService.getPedidos();
    console.log('Pedidos cargados en perfil usuario:', this.pedidos);
    
    // Si no hay pedidos, intentar obtenerlos del backend
    if (this.pedidos.length === 0 && this.authService.isLoggedIn()) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };
        
        // Hacer una petición al backend para obtener los pedidos
        this.http.get('http://localhost:8000/api/orders', { headers }).subscribe(
          (response: any) => {
            console.log('Respuesta del backend (pedidos):', response);
            if (response.status === 'success' && response.orders && Array.isArray(response.orders)) {
              // Transformar los pedidos del backend al formato de la aplicación
              this.pedidos = response.orders.map((order: any) => {
                const pedido: Pedido = {
                  id: order.id,
                  fecha: order.created_at,
                  total: order.total,
                  estado: order.estado || 'Pendiente',
                  productos: []
                };
                
                // Si hay productos en el pedido, añadirlos
                if (order.orderItems && Array.isArray(order.orderItems)) {
                  pedido.productos = order.orderItems.map((item: any) => ({
                    id: item.producto_id,
                    nombre: item.product?.nombre || 'Producto',
                    precio: item.precio,
                    cantidad: item.cantidad,
                    imagen: item.product?.imagen ? 'assets/' + item.product.imagen : 'assets/placeholder.png'
                  }));
                }
                
                return pedido;
              });
              
              // Guardar los pedidos en el servicio
              this.pedidos.forEach(pedido => {
                this.pedidoService.guardarPedido(pedido);
              });
            }
          },
          (          error: any) => {
            console.error('Error al obtener los pedidos del backend:', error);
          }
        );
      }
    }
  }

  verDetallesPedido(id: number): void {
    const pedido = this.pedidoService.getPedidoPorId(id);
    // Aquí puedes implementar la lógica para mostrar los detalles del pedido
    console.log('Detalles del pedido:', pedido);
  }

  guardarMetodoPago() {
    this.metodoPagoSubmitted = true;
    
    if (this.metodoPagoForm.invalid) {
      return;
    }
    
    const nuevoMetodo = {
      tipo: this.metodoPagoForm.value.tipo,
      numero: this.metodoPagoForm.value.numero,
      titular: this.metodoPagoForm.value.titular,
      fechaExpiracion: this.metodoPagoForm.value.fechaExpiracion,
      email: this.metodoPagoForm.value.email
    };
    
    this.metodosPago.push(nuevoMetodo);
    this.mostrarFormMetodoPago = false;
    this.metodoPagoForm.reset({tipo: 'tarjeta'});
    this.metodoPagoSubmitted = false;
  }
}