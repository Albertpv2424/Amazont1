import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { OfertonesComponent } from './components/ofertones/ofertones.component';
import { RecomendadosComponent } from './components/recomendados/recomendados.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { FooterComponent } from "./components/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true, // Indica que este es un componente independiente
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, HeaderComponent, OfertonesComponent, RecomendadosComponent, CategoriasComponent, FooterComponent] // Asegúrate de incluir HeaderComponent aquí
 // Asegúrate de incluir HeaderComponent aquí
})
export class AppComponent {
  isDarkMode = false; // Estado del modo oscuro

  toggleBackground() {
    this.isDarkMode = !this.isDarkMode; // Alternar el estado
  }
}
