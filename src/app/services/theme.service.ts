import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';

export type Theme = 'dark-mode' | 'light-mode';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // Services
  private readonly document = inject(DOCUMENT);

  // Variables
  private readonly currentTheme = signal<Theme>('light-mode');

  constructor() {
    const storedTheme = this.getThemeLocalStorage();
    this.setCurrentTheme(storedTheme);
    this.applyTheme(storedTheme);
  }

  // Methods
  toggleTheme() {
    const newTheme =
      this.currentTheme() === 'light-mode' ? 'dark-mode' : 'light-mode';
    this.setCurrentTheme(newTheme);
    this.applyTheme(newTheme);
    this.setThemeLocalStorage(newTheme);
  }

  private applyTheme(theme: Theme) {
    const bodyClassList = this.document.documentElement.classList;
    if (theme === 'light-mode') {
      bodyClassList.remove('dark-mode');
    } else {
      bodyClassList.add('dark-mode');
    }
  }

  // Getters e setters
  setCurrentTheme(theme: Theme) {
    this.currentTheme.set(theme);
  }

  getCurrentTheme(): Theme {
    return this.currentTheme();
  }

  // LocalStorage
  setThemeLocalStorage(theme: Theme) {
    localStorage.setItem('theme', JSON.stringify(theme));
  }

  getThemeLocalStorage(): Theme {
    const stored = localStorage.getItem('theme');
    return stored ? JSON.parse(stored) : 'light-mode';
  }
}
