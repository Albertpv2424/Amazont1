import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importar CommonModule

@Component({
  selector: 'app-header',
  standalone: true, // Indica que este es un componente independiente
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [CommonModule] // Asegúrate de incluir CommonModule aquí
})
export class HeaderComponent {
  @Output() backgroundToggled = new EventEmitter<void>(); // Evento para notificar el cambio

  toggleBackground() {
    this.backgroundToggled.emit(); // Emitir el evento al componente padre
  }
}