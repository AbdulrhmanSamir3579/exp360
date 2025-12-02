import { Injectable, signal, computed } from '@angular/core';

/**
 * UI State Service
 * Manages UI-related state: filters, theme, live updates status
 */
@Injectable({ providedIn: 'root' })
export class UiState {
  // Private writable signals
  private _darkMode = signal<boolean>(true);
  private _liveUpdatesEnabled = signal<boolean>(true);
  private _selectedTimeRange = signal<'6h' | '12h' | '24h'>('24h');
  private _selectedCategories = signal<Set<string>>(new Set(['all']));
  private _selectedAnomalyTypes = signal<Set<string>>(new Set(['all']));
  private _sidebarCollapsed = signal<boolean>(false);

  // Public read-only signals
  readonly liveUpdatesEnabled = this._liveUpdatesEnabled.asReadonly();
  readonly selectedTimeRange = this._selectedTimeRange.asReadonly();
  readonly selectedCategories = this._selectedCategories.asReadonly();
  readonly selectedAnomalyTypes = this._selectedAnomalyTypes.asReadonly();

  // Computed signals
  readonly theme = computed(() => this._darkMode() ? 'dark' : 'light');

  readonly hasActiveFilters = computed(() => {
    const categories = this._selectedCategories();
    const anomalyTypes = this._selectedAnomalyTypes();
    return !categories.has('all') || !anomalyTypes.has('all');
  });

  // Actions
  toggleDarkMode(): void {
    this._darkMode.update(current => !current);
    this.applyTheme();
  }

  setDarkMode(enabled: boolean): void {
    this._darkMode.set(enabled);
    this.applyTheme();
  }

  toggleLiveUpdates(): void {
    this._liveUpdatesEnabled.update(current => !current);
  }

  setLiveUpdates(enabled: boolean): void {
    this._liveUpdatesEnabled.set(enabled);
  }

  setTimeRange(range: '6h' | '12h' | '24h'): void {
    this._selectedTimeRange.set(range);
  }

  toggleCategory(category: string): void {
    const current = new Set(this._selectedCategories());
    if (category === 'all') {
      current.clear();
      current.add('all');
    } else {
      current.delete('all');
      if (current.has(category)) {
        current.delete(category);
      } else {
        current.add(category);
      }
      if (current.size === 0) {
        current.add('all');
      }
    }
    this._selectedCategories.set(current);
  }

  toggleAnomalyType(type: string): void {
    const current = new Set(this._selectedAnomalyTypes());
    if (type === 'all') {
      current.clear();
      current.add('all');
    } else {
      current.delete('all');
      if (current.has(type)) {
        current.delete(type);
      } else {
        current.add(type);
      }
      if (current.size === 0) {
        current.add('all');
      }
    }
    this._selectedAnomalyTypes.set(current);
  }

  clearFilters(): void {
    this._selectedCategories.set(new Set(['all']));
    this._selectedAnomalyTypes.set(new Set(['all']));
  }

  toggleSidebar(): void {
    this._sidebarCollapsed.update(current => !current);
  }

  private applyTheme(): void {
    const theme = this._darkMode() ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  // Initialize theme from localStorage
  initializeTheme(): void {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      this._darkMode.set(savedTheme === 'dark');
    }
    this.applyTheme();
  }
}
