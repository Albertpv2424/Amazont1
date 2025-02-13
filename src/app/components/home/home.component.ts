import { Component } from '@angular/core';
import { OfertonesComponent } from '../ofertones/ofertones.component';
import { CategoriasComponent } from '../categorias/categorias.component';
import { CommonModule } from '@angular/common';
import { RecomendadosComponent } from "../recomendados/recomendados.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    OfertonesComponent,
    CategoriasComponent,
    RecomendadosComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {}
