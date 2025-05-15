import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { RecuperarPasswordComponent } from './components/recuperar-password/recuperar-password.component';
import { ProductoDetalleComponent } from './components/producto-detalle/producto-detalle.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { CategoriaDetalleComponent } from './components/categoria-detalle/categoria-detalle.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { ConfirmacionCompraComponent } from './components/confirmacion-compra/confirmacion-compra.component';
import { ProcesoPagoComponent } from './components/proceso-pago/proceso-pago.component';
import { PerfilUsuarioComponent } from './components/perfil-usuario/perfil-usuario.component';
import { VendedorComponent } from './components/vendedor/vendedor.component';
import { AuthGuard } from './guards/auth.guard';
import { VendedorGuard } from './guards/vendedor.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [VendedorGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'recuperar-password', component: RecuperarPasswordComponent },
  { path: 'producto/:id', component: ProductoDetalleComponent, canActivate: [VendedorGuard] },
  { path: 'categorias', component: CategoriasComponent, canActivate: [VendedorGuard] },
  { path: 'categoria/:nombre', component: CategoriaDetalleComponent, canActivate: [VendedorGuard] },
  { path: 'categoria/:nombre/:id', component: ProductoDetalleComponent, canActivate: [VendedorGuard] },
  { path: 'carrito', component: CarritoComponent, canActivate: [VendedorGuard] },
  { path: 'proceso-pago', component: ProcesoPagoComponent, canActivate: [VendedorGuard] },
  { path: 'confirmacion-compra', component: ConfirmacionCompraComponent, canActivate: [VendedorGuard] },
  { path: 'perfil-usuario', component: PerfilUsuarioComponent, canActivate: [AuthGuard, VendedorGuard] },
  { path: 'vendedor', component: VendedorComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'vendedor' }
];
