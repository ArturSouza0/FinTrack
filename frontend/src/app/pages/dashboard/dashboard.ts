import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Plus, Wallet, TrendingUp, TrendingDown } from 'lucide-angular';

import { DashboardService } from '../../core/services/dashboard.service';
import { TransactionService } from '../../core/services/transaction.service';
import { CategoryService } from '../../core/services/category.service';
import { ExpenseChartComponent } from '../../shared/components/expense-chart/expense-chart.component';
import { RecentTransactionsComponent } from '../../shared/components/recent-transactions/recent-transactions.component';
import { StatCardsComponent } from '../../shared/components/stat-cards/start-cards.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LucideAngularModule,
    StatCardsComponent,
    ExpenseChartComponent,
    RecentTransactionsComponent
  ],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  private dashboardService = inject(DashboardService);
  private transactionService = inject(TransactionService);
  private categoryService = inject(CategoryService);
  private authService = inject(AuthService);

  private loadAttempts = signal(0);
  private maxLoadAttempts = 3;

  readonly plusIcon = Plus;
  readonly walletIcon = Wallet;
  readonly trendingUpIcon = TrendingUp;
  readonly trendingDownIcon = TrendingDown;

  isLoading = computed(() => this.dashboardService.isLoading());
  categories = computed(() => this.categoryService.categories());
  transactions = computed(() => this.transactionService.transactions());

  statCards = computed(() => {
    const stats = this.dashboardService.stats();
    return [
      {
        title: 'Saldo Atual',
        value: this.formatCurrency(stats.balance),
        icon: this.walletIcon,
        colorClass: 'text-emerald-500'
      },
      {
        title: 'Receitas (total)',
        value: this.formatCurrency(stats.income),
        icon: this.trendingUpIcon,
        colorClass: 'text-emerald-500'
      },
      {
        title: 'Despesas (total)',
        value: this.formatCurrency(stats.expense),
        icon: this.trendingDownIcon,
        colorClass: 'text-red-500'
      }
    ];
  });

  ngOnInit() {
    this.initializeData();
  }

  private async initializeData() {
    const userId = this.getCurrentUserId();
    if (!userId) return;

    try {
      this.categoryService.loadCategories(userId);
      
      this.transactionService.getTransactionsByUserId(userId).subscribe({
        next: () => this.attemptDashboardCalculation(),
        error: () => this.attemptDashboardCalculation()
      });

    } catch (error) {
      this.attemptDashboardCalculation();
    }
  }

  private attemptDashboardCalculation() {
    const attempts = this.loadAttempts();
    if (attempts >= this.maxLoadAttempts) return;

    this.loadAttempts.set(attempts + 1);
    
    setTimeout(() => {
      const hasTransactions = this.transactions().length > 0;
      const hasCategories = this.categories().length > 0;

      if (hasTransactions && hasCategories) {
        this.dashboardService.refresh();
      } else {
        this.attemptDashboardCalculation();
      }
    }, 500);
  }

  reloadData() {
    this.loadAttempts.set(0);
    this.initializeData();
  }

  formatCurrency(value: number): string {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    return numericValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  getRecentTransactions() {
    return this.transactions().slice(0, 5);
  }

  private getCurrentUserId(): string | null {
    return this.authService.getCurrentUserId();
  }
}