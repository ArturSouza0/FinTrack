import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { TrendingUp, TrendingDown } from 'lucide-angular';
import { Transaction } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-recent-transactions',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './recent-transactions.component.html',
})
export class RecentTransactionsComponent {
  transactions = input<Transaction[]>([]);
  categories = input<any[]>([]);
  isLoading = input(false);

  // Ícones
  readonly trendingUpIcon = TrendingUp;
  readonly trendingDownIcon = TrendingDown;

  getCategoryName(categoryId: string): string {
    const category = this.categories().find((cat) => cat.id === categoryId);
    return category?.name || 'Sem categoria';
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  }
}
