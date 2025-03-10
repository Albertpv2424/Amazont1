import { Routes } from '@angular/router';
import { OfertonesComponent } from './components/ofertones/ofertones.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { CategoriaDetalleComponent } from './components/categoria-detalle/categoria-detalle.component';
import { HomeComponent } from './components/home/home.component';
import { ProductoDetalleComponent } from './components/producto-detalle/producto-detalle.component';


export const routes: Routes = [
    {
        path: 'ofertones',
        title: 'Ofertones Page',
        component: OfertonesComponent,
    },
    {
        path: 'categorias',
        title: 'Categorias Page',
        component: CategoriasComponent,
    },
    {
        path: 'categoria/:nombre',
        component: CategoriaDetalleComponent,
    },
    {
        path: 'categoria/:nombre/:id',
        component: ProductoDetalleComponent
    },
    {
        path: ':id',
        component: ProductoDetalleComponent
    },
    { path: '', component: HomeComponent },
    { path: '**', component: HomeComponent }
];
