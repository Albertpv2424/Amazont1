import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { VendedorService } from '../../services/vendedor.service';

@Component({
  selector: 'app-vendedor',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vendedor.component.html',
  styleUrl: './vendedor.component.css'
})
export class VendedorComponent implements OnInit {
  usuario: any;
  isVendedor = false;

  constructor(
    private authService: AuthService,
    private vendedorService: VendedorService
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getCurrentUser();
    // Asegurarse de que la comparación sea case-insensitive
    this.isVendedor = this.usuario?.rol?.toLowerCase() === 'vendedor';

    if (!this.isVendedor && this.usuario) {
      console.warn('Usuario no es vendedor:', this.usuario);
    }
  }
}
