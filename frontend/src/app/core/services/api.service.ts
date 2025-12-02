import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OverviewStats, TimelineEvent, Anomaly } from '../models/workflow.models';

/**
 * API Service
 * Handles HTTP communication with the backend
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly API_URL = 'http://localhost:3000';
  
  constructor(private http: HttpClient) {}
  
  /**
   * Get overview statistics
   */
  getOverview(): Observable<OverviewStats> {
    return this.http.get<OverviewStats>(`${this.API_URL}/stats/overview`);
  }
  
  /**
   * Get timeline events (last 24 hours)
   */
  getTimeline(): Observable<TimelineEvent[]> {
    return this.http.get<TimelineEvent[]>(`${this.API_URL}/stats/timeline`);
  }
  
  /**
   * Get anomalies (last 24 hours)
   */
  getAnomalies(): Observable<Anomaly[]> {
    return this.http.get<Anomaly[]>(`${this.API_URL}/stats/anomalies`);
  }
  
  /**
   * Health check
   */
  healthCheck(): Observable<{ status: string; timestamp: string }> {
    return this.http.get<{ status: string; timestamp: string }>(`${this.API_URL}/health`);
  }
}
