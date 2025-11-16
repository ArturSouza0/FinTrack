// pages/dashboard/dashboard.component.ts
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
  chartData = computed(() => this.dashboardService.chartData());
  categories = computed(() => this.categoryService.categories());

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
    console.log('🚀 Dashboard inicializado');
    this.initializeData();
  }

  private async initializeData() {
    console.log('🔄 Iniciando carregamento de dados...');
    
    const userId = this.getCurrentUserId();
    if (!userId) {
      console.error('❌ UserId não encontrado');
      return;
    }

    try {
      // ✅ CORREÇÃO: Carregar dados explicitamente
      console.log('📥 Carregando transações e categorias...');
      
      // Carrega categorias primeiro (necessárias para o dashboard)
      this.categoryService.loadCategories(userId);
      
      // Carrega transações
      this.transactionService.getTransactionsByUserId(userId).subscribe({
        next: (transactions) => {
          console.log('✅ Transações carregadas:', transactions.length);
          this.attemptDashboardCalculation();
        },
        error: (error) => {
          console.error('❌ Erro ao carregar transações:', error);
          this.attemptDashboardCalculation();
        }
      });

    } catch (error) {
      console.error('❌ Erro no initializeData:', error);
    }
  }

  private attemptDashboardCalculation() {
    const attempts = this.loadAttempts();
    
    if (attempts >= this.maxLoadAttempts) {
      console.log('⏹️ Máximo de tentativas atingido');
      return;
    }

    this.loadAttempts.set(attempts + 1);
    
    console.log(`🔄 Tentativa ${attempts + 1} de cálculo do dashboard...`);
    
    // Aguarda um pouco e tenta calcular
    setTimeout(() => {
      const hasTransactions = this.transactionService.transactions().length > 0;
      const hasCategories = this.categoryService.categories().length > 0;
      
      console.log('📊 Estado atual:', {
        transactions: hasTransactions,
        categories: hasCategories,
        attempts: attempts + 1
      });

      if (hasTransactions && hasCategories) {
        console.log('✅ Dados disponíveis, forçando refresh do dashboard');
        this.dashboardService.refresh();
      } else {
        // Tenta novamente se ainda não atingiu o máximo
        this.attemptDashboardCalculation();
      }
    }, 500);
  }

  // ✅ NOVO: Botão para recarregar manualmente
  reloadData() {
    console.log('🔄 Recarregando dados manualmente...');
    this.loadAttempts.set(0);
    this.initializeData();
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  getRecentTransactions() {
    return this.transactionService.transactions().slice(0, 5);
  }

  private getCurrentUserId(): string | null {
    return this.authService.getCurrentUserId();
  }
}