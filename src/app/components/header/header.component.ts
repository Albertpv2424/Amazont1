import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [CommonModule]
})
export class HeaderComponent {
  @Input() isDarkMode: boolean = false;
  @Output() backgroundToggled = new EventEmitter<void>();

  toggleBackground() {
    this.backgroundToggled.emit();
  }
}
