import { Injectable, signal, computed } from '@angular/core';
import { WorkflowEvent } from '../core/models/workflow.models';

/**
 * Events State Service
 * Manages workflow events using Angular Signals for reactive state management
 */
@Injectable({ providedIn: 'root' })
export class EventsState {
  // Private writable signals
  private _events = signal<WorkflowEvent[]>([]);
  private _loading = signal<boolean>(true);
  private _error = signal<string | null>(null);
  
  // Public read-only signals
  readonly events = this._events.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  
  // Computed signals (derived state)
  readonly eventsLast24Hours = computed(() => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    return this._events()
      .filter(e => new Date(e.timestamp) >= twentyFourHoursAgo)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  });
  
  readonly eventsToday = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this._events().filter(e => {
      const eventDate = new Date(e.timestamp);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === today.getTime();
    });
  });
  
  readonly completedEvents = computed(() =>
    this._events().filter(e => e.status === 'completed')
  );
  
  readonly pendingEvents = computed(() =>
    this._events().filter(e => e.status === 'pending')
  );
  
  readonly anomalyEvents = computed(() =>
    this._events().filter(e => e.status === 'anomaly')
  );
  
  // Actions
  addEvent(event: WorkflowEvent): void {
    this._events.update(events => [...events, event]);
  }
  
  addEvents(newEvents: WorkflowEvent[]): void {
    this._events.update(events => [...events, ...newEvents]);
  }
  
  setEvents(events: WorkflowEvent[]): void {
    this._events.set(events);
  }
  
  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }
  
  setError(error: string | null): void {
    this._error.set(error);
  }
  
  clearEvents(): void {
    this._events.set([]);
  }
  
  removeEvent(id: string): void {
    this._events.update(events => events.filter(e => e.id !== id));
  }
}
