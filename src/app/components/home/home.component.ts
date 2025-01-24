import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { OfertonesComponent } from '../ofertones/ofertones.component';
import { CategoriasComponent } from '../categorias/categorias.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { RecomendadosComponent } from "../recomendados/recomendados.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    OfertonesComponent,
    CategoriasComponent,
    FooterComponent,
    RecomendadosComponent
],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isDarkMode = false;
  toggleBackground() {
    this.isDarkMode = !this.isDarkMode;
  }
}
