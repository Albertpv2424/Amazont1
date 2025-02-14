import { Component, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Categoria } from '../../interfaces/categoria.interface';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { Producto } from '../../interfaces/producto.interface';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  producto = input<Producto>({
    imagen: 'assets/default.png',
    titulo: 'Producto sin título',
    descuento: '0%'
  });

  isDarkMode = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.themeService.darkMode$.subscribe(
      isDark => this.isDarkMode = isDark
    );
  }

  get productoValue(): Producto {
    return this.producto();
  }
}
