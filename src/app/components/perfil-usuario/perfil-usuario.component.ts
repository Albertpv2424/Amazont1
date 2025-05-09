import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
  submitted = false;
  metodoPagoSubmitted = false;
  pagoSubmitted = false;
  isDarkMode = false;
  activeTab = 0;
  mostrarFormMetodoPago = false;
  tabSeleccionado = 0;
  nuevoMetodoPago = false;
  cargandoMetodosPago = false;
  errorCarga = '';

  metodosPago: any[] = [];
  pedidos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private themeService: ThemeService,
    private authService: AuthService // Add AuthService
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
      fechaExpiracion: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]]
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

  // Update the cargarMetodosPago method
  cargarMetodosPago(): void {
    // Check for payment methods in localStorage
    const metodosGuardados = localStorage.getItem('metodosPago');
    
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
      const nuevoMetodo = {
        id: Date.now(), // Simple unique ID
        tipo: this.metodoPagoForm.value.tipo,
        numero: this.ocultarNumeroTarjeta(this.metodoPagoForm.value.numero),
        titular: this.metodoPagoForm.value.titular,
        fechaExpiracion: this.metodoPagoForm.value.fechaExpiracion,
        numeroCompleto: this.metodoPagoForm.value.numero // Save for internal use
      };
      
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

 

  ocultarNumeroTarjeta(numero: string): string {
    if (numero && numero.length >= 4) {
      return '**** **** **** ' + numero.slice(-4);
    }
    return numero;
  }



  cambiarPassword(): void {
    alert('Funcionalidad de cambio de contraseña en desarrollo');
  }

  verDetallesPedido(id: number): void {
    alert(`Viendo detalles del pedido ${id}`);
  }

  // Add this method to handle payment form submission
  guardarMetodoPago(): void {
    this.pagoSubmitted = true;
    
    if (this.pagoForm.valid) {
      // Create new payment method object
      const nuevoMetodo = {
        id: Date.now(), // Generate a simple unique ID
        tipo: this.p['tipo'].value,
        numero: this.p['tipo'].value === 'credit_card' ? 
          this.ocultarNumeroTarjeta(this.p['numeroTarjeta'].value) : 
          (this.p['tipo'].value === 'paypal' ? this.p['correoPaypal'].value : this.p['numeroCuenta'].value),
        titular: this.p['titular'].value,
        fechaExpiracion: this.p['fechaExpiracion'].value,
        isDefault: true
      };
      
      // Add to the list
      this.metodosPago.push(nuevoMetodo);
      
      // Save to localStorage
      localStorage.setItem('metodosPago', JSON.stringify(this.metodosPago));
      
      // Reset form and hide
      this.nuevoMetodoPago = false;
      this.pagoSubmitted = false;
      this.pagoForm.reset({
        tipo: 'credit_card',
        guardarMetodo: true
      });
      
      // Show success message
      alert('Método de pago añadido correctamente');
    }
  }
}

const routes: Routes = [
  { path: 'perfil', component: PerfilUsuarioComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

