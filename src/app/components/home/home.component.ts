import { Component, OnInit} from '@angular/core';
import { OfertonesComponent } from '../ofertones/ofertones.component';
import { CategoriasComponent } from '../categorias/categorias.component';
import { CommonModule } from '@angular/common';
import { RecomendadosComponent } from "../recomendados/recomendados.component";
import { ActivatedRoute } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    OfertonesComponent,
    CategoriasComponent,
    RecomendadosComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  isDarkMode = false;

    constructor(
      private route: ActivatedRoute,
  
      private themeService: ThemeService
    ) {}
    ngOnInit() {
    
    this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
  }
}