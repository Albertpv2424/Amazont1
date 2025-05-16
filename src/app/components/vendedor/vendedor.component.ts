import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { VendedorService } from '../../services/vendedor.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-vendedor',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vendedor.component.html',
  styleUrls: ['./vendedor.component.css']
})
export class VendedorComponent implements OnInit {
  usuario: any;
  isVendedor = false;
  isDarkMode = false;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private vendedorService: VendedorService
  ) {}

  ngOnInit(): void {
    // Inicialitzar el mode fosc abans de tot
    this.themeService.darkMode$.subscribe(
      isDark => {
        console.log('Mode fosc actualitzat a vendedor:', isDark);
        this.isDarkMode = isDark;
      }
    );
    
    this.usuario = this.authService.getCurrentUser();
    // Asegurarse de que la comparación sea case-insensitive
    this.isVendedor = this.usuario?.rol?.toLowerCase() === 'vendedor';

    if (!this.isVendedor && this.usuario) {
      console.warn('Usuario no es vendedor:', this.usuario);
    }
  }
}
