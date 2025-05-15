import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { ProductoDetalleComponent } from './components/producto-detalle/producto-detalle.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { PerfilUsuarioComponent } from './components/perfil-usuario/perfil-usuario.component';
import { ProcesoPagoComponent } from './components/proceso-pago/proceso-pago.component';
import { ConfirmacionCompraComponent } from './components/confirmacion-compra/confirmacion-compra.component';
import { VendedorComponent } from './components/vendedor/vendedor.component';
import { VendedorEstadisticasComponent } from './components/vendedor/vendedor-estadisticas/vendedor-estadisticas.component';
import { VendedorProductosComponent } from './components/vendedor/vendedor-productos/vendedor-productos.component';
import { VendedorFormularioComponent } from './components/vendedor/vendedor-formulario/vendedor-formulario.component';
// Update the imports to use the correct names
import { AuthGuard } from './guards/auth.guard';
import { VendedorGuard } from './guards/vendedor.guard';
import { RecuperarPasswordComponent } from './components/recuperar-password/recuperar-password.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { CategoriaDetalleComponent } from './components/categoria-detalle/categoria-detalle.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'recuperar-password', component: RecuperarPasswordComponent },
  { path: 'producto/:id', component: ProductoDetalleComponent },
  { path: 'categorias', component: CategoriasComponent },
  { path: 'categoria/:nombre', component: CategoriaDetalleComponent },
  { path: 'categoria/:nombre/:id', component: ProductoDetalleComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'proceso-pago', component: ProcesoPagoComponent },
  { path: 'confirmacion-compra', component: ConfirmacionCompraComponent },
  {path: 'perfil-usuario', component: PerfilUsuarioComponent},
  { path: 'vendedor', component: VendedorComponent,
    children: [
      { path: '', redirectTo: 'estadisticas', pathMatch: 'full' },
      { path: 'estadisticas', component: VendedorEstadisticasComponent },
      { path: 'productos', component: VendedorProductosComponent },
      { path: 'formulario', component: VendedorFormularioComponent },
      { path: 'formulario/:id', component: VendedorFormularioComponent }
    ]
  },
  { path: '**', redirectTo: '' },

  {
    path: 'vendedor',
    component: VendedorComponent,
    canActivate: [AuthGuard, VendedorGuard],
    children: [
      { path: '', redirectTo: 'estadisticas', pathMatch: 'full' },
      { path: 'estadisticas', component: VendedorEstadisticasComponent },
      { path: 'productos', component: VendedorProductosComponent },
      { path: 'formulario', component: VendedorFormularioComponent },
      { path: 'formulario/:id', component: VendedorFormularioComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
