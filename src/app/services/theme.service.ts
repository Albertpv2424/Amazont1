import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkMode.asObservable();

  toggleDarkMode() {
    const newValue = !this.darkMode.value;
    this.darkMode.next(newValue);
    localStorage.setItem('darkMode', newValue.toString());
  }

  initializeTheme() {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      this.darkMode.next(savedTheme === 'true');
    }
  }
}
