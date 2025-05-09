import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { PedidoService } from '../../services/pedido.service';
import { Pedido } from '../../models/pedido.model';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
    private authService: AuthService, // Add AuthService
    private pedidoService: PedidoService
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
  }

  agregarMetodoPago(): void {
    this.metodoPagoSubmitted = true;
    
    if (this.metodoPagoForm.valid) {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) return;
      
      // Create new payment method with ID
      let nuevoMetodo: any = {
        id: Date.now(), // Simple unique ID
        tipo: this.metodoPagoForm.value.tipo
      };
      
      // Afegir propietats específiques segons el tipus de pagament
      if (this.metodoPagoForm.value.tipo === 'Tarjeta') {
        nuevoMetodo.numero = this.ocultarNumeroTarjeta(this.metodoPagoForm.value.numero);
        nuevoMetodo.titular = this.metodoPagoForm.value.titular;
        nuevoMetodo.fechaExpiracion = this.metodoPagoForm.value.fechaExpiracion;
        nuevoMetodo.numeroCompleto = this.metodoPagoForm.value.numero; // Save for internal use
      } else if (this.metodoPagoForm.value.tipo === 'PayPal') {
        nuevoMetodo.correoPaypal = this.metodoPagoForm.value.correoPaypal;
      } else if (this.metodoPagoForm.value.tipo === 'Transferencia') {
        nuevoMetodo.numeroCuenta = this.metodoPagoForm.value.numeroCuenta;
        nuevoMetodo.entidadBancaria = this.metodoPagoForm.value.entidadBancaria;
      }
      
      // Add to the list
      this.metodosPago.push(nuevoMetodo);
      
      // Use user-specific key for payment methods
      const userKey = `metodosPago_${currentUser.email}`;
      localStorage.setItem(userKey, JSON.stringify(this.metodosPago));
      
      console.log('Método de pago añadido:', nuevoMetodo);
      console.log('Métodos de pago actualizados:', this.metodosPago);
      
      // Hide form and reset
      this.ocultarFormularioMetodoPago();
      
      // Show success message
      alert('Método de pago añadido correctamente');
    }
  }

  eliminarMetodoPago(index: number): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;
    
    if (confirm('¿Estás seguro que quieres eliminar este método de pago?')) {
      this.metodosPago.splice(index, 1);
      
      // Use user-specific key for payment methods
      const userKey = `metodosPago_${currentUser.email}`;
      localStorage.setItem(userKey, JSON.stringify(this.metodosPago));
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.perfilForm.valid) {
      // Get current user
      const currentUser = this.authService.getCurrentUser();
      
      if (currentUser) {
        // Update user data
        const updatedUser = {
          ...currentUser,
          nombre: this.perfilForm.value.nombre,
          email: this.perfilForm.value.email,
          telefono: this.perfilForm.value.telefono,
          ciudad: this.perfilForm.value.ciudad,
          pais: this.perfilForm.value.pais
        };
        
        // Update the user in AuthService
        this.authService.updateCurrentUser(updatedUser);
        
        // Show success message
        alert('Perfil actualizado correctamente');
        this.submitted = false;
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
    this.pedidos = this.pedidoService.getPedidos();
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