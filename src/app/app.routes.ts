import { Routes } from '@angular/router';

import { OfertonesComponent } from './components/ofertones/ofertones.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { RecomendadosComponent } from './components/recomendados/recomendados.component';

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
        path: 'recomendados',
        title: 'Recomendados Page',
        component: RecomendadosComponent,
    },
];
