import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { OfertonesComponent } from './components/ofertones/ofertones.component';
import { RecomendadosComponent } from './components/recomendados/recomendados.component';
import { CategoriasComponent } from './components/categorias/categorias.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    OfertonesComponent,
    CategoriasComponent,
    RecomendadosComponent
  ],
  template: `
    <app-header></app-header>
    <app-ofertones></app-ofertones>
    <app-categorias></app-categorias>
    <app-recomendados></app-recomendados>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent { }
