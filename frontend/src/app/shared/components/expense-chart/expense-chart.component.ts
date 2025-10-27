import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartData } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-expense-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expense-chart.component.html'
})
export class ExpenseChartComponent {
  chartData = input<ChartData[]>([]);
  isLoading = input(false);

  readonly colors = [
    '#10b981',
    '#22c55e',
    '#84cc16',
    '#eab308',
    '#f97316',
    '#ef4444',
    '#ec4899',
    '#8b5cf6',
  ];

  getColor(index: number): string {
    return this.colors[index % this.colors.length];
  }

  getDashArray(value: number, index: number): string {
    const total = this.chartData().reduce((sum, item) => sum + item.value, 0);
    const percentage = (value / total) * 100;
    const circumference = 2 * Math.PI * 40;
    const dashLength = (percentage / 100) * circumference;
    const gapLength = circumference - dashLength;

    let offset = 25;
    for (let i = 0; i < index; i++) {
      const segmentValue = this.chartData()[i].value;
      const segmentPercentage = (segmentValue / total) * 100;
      offset += (segmentPercentage / 100) * circumference;
    }

    return `${dashLength} ${gapLength}`;
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }
}
