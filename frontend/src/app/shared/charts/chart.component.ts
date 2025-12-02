import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsDirective } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { ChartType, ChartConfig } from './chart.models';
import { ChartThemeService } from './chart-theme.service';
import { ChartPlaceholderComponent } from './chart-placeholder/chart-placeholder.component';
import { ThemeService } from '@core/services';

/**
 * Enhanced Chart Component with click event handling and theme reactivity
 */
@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, NgxEchartsDirective, ChartPlaceholderComponent],
  template: `
    <div class="chart-container" [style.height]="height" [style.width]="width">
      @if (!hasData()) {
        <app-chart-placeholder [height]="'100%'" [width]="'100%'" />
      } @else {
        <div
          echarts
          [options]="chartOptions()"
          [autoResize]="true"
          [style.height]="'100%'"
          [style.width]="'100%'"
          (chartClick)="onChartClick($event)"
          class="chart">
        </div>
      }
    </div>
  `,
  styles: [`
    .chart-container {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .chart {
      width: 100%;
      height: 100%;
    }
  `]
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() type: ChartType = 'bar';
  @Input() config: Partial<ChartConfig> = {};
  @Input() height: string = '100%';
  @Input() width: string = '100%';

  @Output() cellClick = new EventEmitter<any>();

  private chartThemeService = inject(ChartThemeService);
  private themeService = inject(ThemeService);

  // Convert data to signal for reactivity
  private dataSignal = signal<any[]>([]);

  @Input()
  set data(value: any[]) {
    this.dataSignal.set(value || []);
  }

  get data(): any[] {
    return this.dataSignal();
  }

  // Computed signal for hasData
  hasData = computed(() => {
    const data = this.dataSignal();
    return data && data.length > 0;
  });

  // Computed signal that tracks theme changes to force chart recreation
  private themeKey = computed(() => this.themeService.isDarkMode() ? 'dark' : 'light');

  // Computed signal for chart options that reacts to both data and theme changes
  chartOptions = computed(() => {
    const data = this.dataSignal();
    const themeKey = this.themeKey(); // Track theme changes

    if (!data || data.length === 0) {
      return {};
    }

    // Generate new options whenever data or theme changes
    const options = this.chartThemeService.getChartOption(
      this.type,
      data,
      this.config
    );

    // Add a unique key to force ngx-echarts to recreate the chart
    return {
      ...options,
      _themeKey: themeKey,
      _timestamp: Date.now()
    };
  });

  ngOnInit(): void {
    // Options are already reactive via computed signal
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['type'] || changes['config']) {
      this.dataSignal.set([...this.dataSignal()]);
    }
  }

  onChartClick(event: any): void {
    if (this.type === 'heatmap' && event.data) {
      // For heatmap, emit the cell data
      const [x, y, value] = event.data;
      const data = this.dataSignal();
      const cellData = data.find(d => d.x === x && d.y === y);

      if (cellData?.cellData) {
        this.cellClick.emit(cellData.cellData);
      }
    }
  }
}
