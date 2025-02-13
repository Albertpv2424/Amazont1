import { Routes } from '@angular/router';
import { OfertonesComponent } from './components/ofertones/ofertones.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { CategoriaDetalleComponent } from './components/categoria-detalle/categoria-detalle.component';
import { HomeComponent } from './components/home/home.component';

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
        component: CategoriaDetalleComponent
    },
    { path: '', component: HomeComponent }
];
