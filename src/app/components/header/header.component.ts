import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Categoria } from '../../interfaces/categoria.interface';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [CommonModule, RouterModule]
})
export class HeaderComponent implements OnInit {
  @Input() isDarkMode: boolean = false;
  @Output() backgroundToggled = new EventEmitter<void>();
  
  isLoggedIn = false;
  userName: string = '';
  
  categorias: Categoria[] = [
    { nombre: 'Tecnología', imagen: 'assets/tecnologia.png' },
    { nombre: 'Deportes', imagen: 'assets/deportes.png' },
    { nombre: 'Cocina', imagen: 'assets/cocina.png' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Subscribe to authentication state changes
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      
      if (isLoggedIn) {
        const user = this.authService.getCurrentUser();
        if (user) {
          this.userName = user.nombre;
        }
      } else {
        this.userName = '';
      }
    });
  }

  toggleBackground() {
    this.backgroundToggled.emit();
  }

  logout() {
    this.authService.logout();
  }
  
  navegarACategoria(categoria: string) {
    this.router.navigate(['/categoria', categoria]);
  }
  
  navegarACategorias() {
    this.router.navigate(['/categorias']);
  }

  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    
    if (value) {
      this.navegarACategoria(value);
    } else {
      this.navegarACategorias();
    }
  }
}
