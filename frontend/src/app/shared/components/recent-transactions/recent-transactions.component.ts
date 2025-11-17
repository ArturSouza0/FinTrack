// components/recent-transactions/recent-transactions.component.ts
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ShoppingCart,
  Home,
  Utensils,
  Car,
  Heart,
  School,
  Gift,
} from 'lucide-angular';
import { Transaction } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-recent-transactions',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './recent-transactions.component.html',
})
export class RecentTransactionsComponent {
  transactions = input<Transaction[]>([]);
  categories = input<any[]>([]);
  isLoading = input(false);

  // Ícones
  readonly trendingUpIcon = TrendingUp;
  readonly trendingDownIcon = TrendingDown;
  readonly walletIcon = Wallet;
  readonly shoppingCartIcon = ShoppingCart;
  readonly homeIcon = Home;
  readonly utensilsIcon = Utensils;
  readonly carIcon = Car;
  readonly heartIcon = Heart;
  readonly schoolIcon = School;
  readonly giftIcon = Gift;

  // ✅ ADD: Get transaction color based on type
  getTransactionColor(type: 'income' | 'expense'): string {
    return type === 'income'
      ? 'text-emerald-500 bg-emerald-500/10'
      : 'text-red-500 bg-red-500/10';
  }

  // ✅ ADD: Get transaction icon based on type
  getTransactionIcon(type: 'income' | 'expense') {
    return type === 'income' ? this.trendingUpIcon : this.trendingDownIcon;
  }

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
