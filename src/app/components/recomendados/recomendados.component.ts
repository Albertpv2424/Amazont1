import { Component } from '@angular/core';

@Component({
  selector: 'app-recomendados',
  standalone: true,
  templateUrl: './recomendados.component.html',
  styleUrls: ['./recomendados.component.css']
})
export class RecomendadosComponent {
  recomendados = [
    { imagen: 'assets/maquillaje.png', descripcion: 'Belleza y Regalos' },
    { imagen: 'assets/regalos.png', descripcion: 'Regalos perfectos para tus seres queridos' }
  ];
}
