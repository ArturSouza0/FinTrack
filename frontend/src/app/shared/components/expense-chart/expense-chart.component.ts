import {
  Component,
  input,
  computed,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface PieChartData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

@Component({
  selector: 'app-expense-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expense-chart.component.html',
})
export class ExpenseChartComponent implements OnChanges {
  transactions = input<any[]>([]);
  categories = input<any[]>([]);
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

  chartData = computed<PieChartData[]>(() => {
    const transactions = this.transactions();
    const categories = this.categories();

    if (!transactions?.length || !categories?.length) {
      return [];
    }

    const expenseTransactions = transactions.filter((t) => {
      if (!t || !t.categoryId) return false;

      const amount =
        typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
      if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
        return false;
      }

      const expenseTypes = ['expense', 'despesa'];
      return expenseTypes.includes(t.type?.toLowerCase?.());
    });

    if (expenseTransactions.length === 0) {
      return [];
    }

    const categoryMap = categories.reduce(
      (map: Record<string, string>, cat) => {
        if (cat && cat.id) {
          map[cat.id] = cat.name || 'Sem nome';
        }
        return map;
      },
      {}
    );

    const expenseByCategory = expenseTransactions.reduce(
      (acc: Record<string, number>, curr) => {
        const categoryName = categoryMap[curr.categoryId] || 'Outros';
        const amount =
          typeof curr.amount === 'string'
            ? parseFloat(curr.amount)
            : curr.amount;
        acc[categoryName] = (acc[categoryName] || 0) + amount;
        return acc;
      },
      {}
    );

    const total = Object.values(expenseByCategory).reduce(
      (sum: number, value) => sum + value,
      0
    );

    return Object.entries(expenseByCategory).map(([name, value], index) => ({
      name,
      value: value as number,
      percentage: total > 0 ? ((value as number) / total) * 100 : 0,
      color: this.colors[index % this.colors.length],
    }));
  });

  chartConfig = computed(() => {
    const data = this.chartData();
    const total = data.reduce((sum: number, item) => sum + item.value, 0);

    return {
      centerX: 150,
      centerY: 150,
      radius: 110,
      total,
      hasData: data.length > 0,
    };
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transactions'] || changes['categories']) {
      this.chartData();
    }
  }

  getPointOnCircle(
    angle: number,
    radius: number,
    centerX: number,
    centerY: number
  ): { x: number; y: number } {
    const rad = (angle * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(rad),
      y: centerY + radius * Math.sin(rad),
    };
  }

  getSegmentPath(
    startAngle: number,
    endAngle: number,
    radius: number,
    centerX: number,
    centerY: number
  ): string {
    const start = this.getPointOnCircle(startAngle, radius, centerX, centerY);
    const end = this.getPointOnCircle(endAngle, radius, centerX, centerY);
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

    return [
      `M ${centerX} ${centerY}`,
      `L ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
      'Z',
    ].join(' ');
  }

  getSegmentAngles(): { startAngle: number; endAngle: number }[] {
    const data = this.chartData();
    const total = data.reduce((sum: number, item) => sum + item.value, 0);
    if (total === 0) return [];

    let currentAngle = 0;
    return data.map((item) => {
      const segmentAngle = (item.value / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + segmentAngle;
      currentAngle = endAngle;
      return { startAngle, endAngle };
    });
  }

  shouldLabelBeExternal(
    segmentAngles: { startAngle: number; endAngle: number } | null,
    index: number
  ): boolean {
    if (!segmentAngles) return false;
    const data = this.chartData();
    if (index >= data.length) return false;
    return data[index].percentage >= 5;
  }

  formatCurrency(value: number): string {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    return numericValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  trackByName(index: number, item: PieChartData): string {
    return item.name;
  }
}
