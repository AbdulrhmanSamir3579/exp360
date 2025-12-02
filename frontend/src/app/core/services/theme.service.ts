import { Injectable, signal, computed } from '@angular/core';

/**
 * Theme Service
 * Manages application theme (dark/light mode)
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _isDarkMode = signal<boolean>(true);
  
  // Public read-only signal
  readonly isDarkMode = this._isDarkMode.asReadonly();
  
  // Computed theme name
  readonly currentTheme = computed(() => this._isDarkMode() ? 'dark' : 'light');
  
  constructor() {
    this.initializeTheme();
  }
  
  /**
   * Toggle between dark and light mode
   */
  toggleTheme(): void {
    this._isDarkMode.update(current => !current);
    this.applyTheme();
  }
  
  /**
   * Set specific theme
   */
  setTheme(isDark: boolean): void {
    this._isDarkMode.set(isDark);
    this.applyTheme();
  }
  
  /**
   * Initialize theme from localStorage or system preference
   */
  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    
    if (savedTheme) {
      this._isDarkMode.set(savedTheme === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this._isDarkMode.set(prefersDark);
    }
    
    this.applyTheme();
    this.listenToSystemThemeChanges();
  }
  
  /**
   * Apply theme to document and save to localStorage
   */
  private applyTheme(): void {
    const theme = this._isDarkMode() ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
  
  /**
   * Listen to system theme changes
   */
  private listenToSystemThemeChanges(): void {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        // Only auto-update if user hasn't manually set a preference
        this._isDarkMode.set(e.matches);
        this.applyTheme();
      }
    });
  }
}
