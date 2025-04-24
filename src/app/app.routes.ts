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
  { path: '**', redirectTo: '' }
];
