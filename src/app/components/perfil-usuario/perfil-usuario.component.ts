import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
  submitted = false;
  metodoPagoSubmitted = false;
  isDarkMode = false;
  activeTab = 0;
  mostrarFormMetodoPago = false;

  metodosPago: any[] = [];
  pedidos: any[] = []; // Array para almacenar los pedidos

  constructor(
    private fb: FormBuilder,
    private themeService: ThemeService
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

    // Cargar datos del usuario
    this.perfilForm.patchValue({
      nombre: 'Juan Pérez',
      email: 'juan@example.com',
      telefono: '600123456',
      ciudad: 'Barcelona',
      pais: 'España'
    });

    // Carregar mètodes de pagament des del localStorage
    this.cargarMetodosPago();

    // Suscribirse al servicio de tema
    this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );

    // Cargar pedidos (simulación)
    this.pedidos = [];
  }

  cargarMetodosPago(): void {
    const metodosGuardados = localStorage.getItem('metodosPago');
    if (metodosGuardados) {
      this.metodosPago = JSON.parse(metodosGuardados);
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.perfilForm.valid) {
      // Guardar cambios del perfil
      alert('Perfil actualizado correctamente');
      this.submitted = false;
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

  agregarMetodoPago(): void {
    this.metodoPagoSubmitted = true;
    
    if (this.metodoPagoForm.valid) {
      // Crear nuevo método de pago
      const nuevoMetodo = {
        tipo: this.metodoPagoForm.value.tipo,
        numero: this.ocultarNumeroTarjeta(this.metodoPagoForm.value.numero),
        titular: this.metodoPagoForm.value.titular,
        fechaExpiracion: this.metodoPagoForm.value.fechaExpiracion,
        numeroCompleto: this.metodoPagoForm.value.numero // Guardar para uso interno
      };
      
      // Añadir a la lista
      this.metodosPago.push(nuevoMetodo);
      
      // Guardar en localStorage
      localStorage.setItem('metodosPago', JSON.stringify(this.metodosPago));
      
      // Ocultar formulario y resetear
      this.ocultarFormularioMetodoPago();
      
      // Mostrar mensaje de éxito
      alert('Mètode de pagament afegit correctament');
    }
  }

  ocultarNumeroTarjeta(numero: string): string {
    if (numero && numero.length >= 4) {
      return '**** **** **** ' + numero.slice(-4);
    }
    return numero;
  }

  eliminarMetodoPago(index: number): void {
    if (confirm('Estàs segur que vols eliminar aquest mètode de pagament?')) {
      this.metodosPago.splice(index, 1);
      localStorage.setItem('metodosPago', JSON.stringify(this.metodosPago));
    }
  }

  cambiarTab(index: number): void {
    this.activeTab = index;
    
    // Ocultar todos los contenidos de pestañas
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach((tab, i) => {
      if (i === index) {
        (tab as HTMLElement).style.display = 'block';
      } else {
        (tab as HTMLElement).style.display = 'none';
      }
    });
    
    // Actualizar clases de los botones de pestañas
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach((btn, i) => {
      if (i === index) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  cambiarPassword(): void {
    // Implementar lógica para cambiar contraseña
    alert('Funcionalidad de cambio de contraseña en desarrollo');
  }

  verDetallesPedido(id: number): void {
    // Implementar lógica para ver detalles de un pedido
    alert(`Viendo detalles del pedido ${id}`);
  }

  get f() { return this.perfilForm.controls; }
  get mp() { return this.metodoPagoForm.controls; }
}

const routes: Routes = [
  // ...otras rutas...
  { path: 'perfil', component: PerfilUsuarioComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
