import { Injectable, signal, computed } from '@angular/core';
import { OverviewStats } from '../core/models/workflow.models';

/**
 * Metrics State Service
 * Manages overview statistics using Angular Signals
 */
@Injectable({ providedIn: 'root' })
export class MetricsState {
  // Private writable signals
  private _stats = signal<OverviewStats>({
    totalWorkflowsToday: 0,
    averageCycleTime: 0,
    slaCompliance: 100,
    activeAnomaliesCount: 0
  });
  private _loading = signal<boolean>(true);
  private _lastUpdated = signal<Date | null>(null);
  
  // Public read-only signals
  readonly stats = this._stats.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly lastUpdated = this._lastUpdated.asReadonly();
  
  // Computed signals
  readonly slaStatus = computed(() => {
    const compliance = this._stats().slaCompliance;
    if (compliance >= 95) return 'excellent';
    if (compliance >= 85) return 'good';
    if (compliance >= 70) return 'warning';
    return 'critical';
  });
  
  readonly cycleTimeStatus = computed(() => {
    const cycleTime = this._stats().averageCycleTime;
    if (cycleTime < 30) return 'fast';
    if (cycleTime < 60) return 'normal';
    if (cycleTime < 90) return 'slow';
    return 'critical';
  });
  
  readonly anomalyStatus = computed(() => {
    const count = this._stats().activeAnomaliesCount;
    if (count === 0) return 'none';
    if (count < 5) return 'low';
    if (count < 10) return 'medium';
    return 'high';
  });
  
  // Actions
  updateStats(stats: Partial<OverviewStats>): void {
    this._stats.update(current => ({ ...current, ...stats }));
    this._lastUpdated.set(new Date());
  }
  
  setStats(stats: OverviewStats): void {
    this._stats.set(stats);
    this._lastUpdated.set(new Date());
  }
  
  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }
  
  resetStats(): void {
    this._stats.set({
      totalWorkflowsToday: 0,
      averageCycleTime: 0,
      slaCompliance: 100,
      activeAnomaliesCount: 0
    });
  }
}
