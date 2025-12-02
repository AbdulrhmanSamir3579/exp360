import { Injectable, signal, computed } from '@angular/core';
import { Anomaly } from '../core/models/workflow.models';

/**
 * Anomalies State Service
 * Manages anomaly data with filtering and grouping
 */
@Injectable({ providedIn: 'root' })
export class AnomaliesState {
  // Private writable signals
  private _anomalies = signal<Anomaly[]>([]);
  private _loading = signal<boolean>(true);
  
  // Public read-only signals
  readonly anomalies = this._anomalies.asReadonly();
  readonly loading = this._loading.asReadonly();
  
  // Computed signals
  readonly anomaliesLast24Hours = computed(() => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    return this._anomalies()
      .filter(a => new Date(a.timestamp) >= twentyFourHoursAgo)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  });
  readonly criticalAnomalies = computed(() =>
    this._anomalies().filter(a => a.severity === 'critical')
  );
  
  readonly highAnomalies = computed(() =>
    this._anomalies().filter(a => a.severity === 'high')
  );
  
  readonly mediumAnomalies = computed(() =>
    this._anomalies().filter(a => a.severity === 'medium')
  );
  
  readonly lowAnomalies = computed(() =>
    this._anomalies().filter(a => a.severity === 'low')
  );
  
  // Group anomalies by hour for heatmap
  readonly anomaliesByHour = computed(() => {
    const byHour: { [hour: number]: Anomaly[] } = {};
    this.anomaliesLast24Hours().forEach(anomaly => {
      const hour = anomaly.hour ?? new Date(anomaly.timestamp).getHours();
      if (!byHour[hour]) {
        byHour[hour] = [];
      }
      byHour[hour].push(anomaly);
    });
    return byHour;
  });
  
  // Group by severity for visualization
  readonly anomaliesBySeverity = computed(() => {
    const result: { [key: string]: number } = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    };
    this._anomalies().forEach(a => {
      result[a.severity]++;
    });
    return result;
  });
  
  // Group by type
  readonly anomaliesByType = computed(() => {
    const result: { [key: string]: number } = {};
    this._anomalies().forEach(a => {
      result[a.type] = (result[a.type] || 0) + 1;
    });
    return result;
  });
  
  // Actions
  addAnomaly(anomaly: Anomaly): void {
    this._anomalies.update(anomalies => [...anomalies, anomaly]);
  }
  
  addAnomalies(newAnomalies: Anomaly[]): void {
    this._anomalies.update(anomalies => [...anomalies, ...newAnomalies]);
  }
  
  setAnomalies(anomalies: Anomaly[]): void {
    this._anomalies.set(anomalies);
  }
  
  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }
  
  clearAnomalies(): void {
    this._anomalies.set([]);
  }
  
  removeAnomaly(id: string): void {
    this._anomalies.update(anomalies => anomalies.filter(a => a.id !== id));
  }
}
