import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
    currentYear: number;

    constructor() {
        this.currentYear = new Date().getFullYear(); // Obtener el año actual
    }
}
