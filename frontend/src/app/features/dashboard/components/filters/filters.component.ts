import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiState } from '@store/ui.state';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css'
})
export class FiltersComponent {
  private uiState = inject(UiState);
  private themeService = inject(ThemeService);
  
  // Expose state to template
  darkMode = this.themeService.isDarkMode;
  liveUpdatesEnabled = this.uiState.liveUpdatesEnabled;
  selectedCategories = this.uiState.selectedCategories;
  selectedAnomalyTypes = this.uiState.selectedAnomalyTypes;
  
  categories = ['all', 'case_intake', 'approval', 'document_review', 'completed'];
  anomalyTypes = ['all', 'delay', 'sla_breach', 'stuck_workflow', 'duplicate_case'];
  
  toggleDarkMode(): void {
    this.themeService.toggleTheme();
  }
  
  toggleLiveUpdates(): void {
    this.uiState.toggleLiveUpdates();
  }
  
  toggleCategory(category: string): void {
    this.uiState.toggleCategory(category);
  }
  
  toggleAnomalyType(type: string): void {
    this.uiState.toggleAnomalyType(type);
  }
  
  clearFilters(): void {
    this.uiState.clearFilters();
  }
  
  formatLabel(text: string): string {
    return text.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
}
