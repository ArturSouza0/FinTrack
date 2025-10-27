import { Injectable, inject, signal, effect } from '@angular/core';
import { TransactionService } from './transaction.service';
import { CategoryService } from './category.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private transactionService = inject(TransactionService);
  private categoryService = inject(CategoryService);

  stats = signal({ balance: 0, income: 0, expense: 0 });
  chartData = signal<any[]>([]);
  isLoading = signal(true);

  constructor() {
    // ✅ CORREÇÃO: Usar effect para reagir quando os dados estiverem disponíveis
    effect(() => {
      const transactions = this.transactionService.transactions();
      const categories = this.categoryService.categories();
      
      console.log('🔍 DashboardService - Dados recebidos:', {
        transactionsCount: transactions.length,
        categoriesCount: categories.length
      });

      if (transactions.length > 0 && categories.length > 0) {
        console.log('📊 Calculando dashboard com dados disponíveis...');
        this.calculateDashboardData(transactions, categories);
      } else if (this.isLoading()) {
        console.log('⏳ Aguardando dados...');
        // Se ainda não há dados, tenta carregar após um delay
        setTimeout(() => {
          const currentTransactions = this.transactionService.transactions();
          const currentCategories = this.categoryService.categories();
          if (currentTransactions.length > 0 && currentCategories.length > 0) {
            this.calculateDashboardData(currentTransactions, currentCategories);
          } else {
            console.log('❌ Dados ainda não disponíveis após timeout');
            this.isLoading.set(false);
          }
        }, 1000);
      }
    });
  }

  private calculateDashboardData(transactions: any[], categories: any[]) {
    console.log('🧮 Calculando estatísticas...', transactions);
    
    try {
      const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + this.parseAmount(t.amount), 0);

      const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + this.parseAmount(t.amount), 0);

      this.stats.set({
        balance: income - expense,
        income,
        expense,
      });

      this.calculateChartData(transactions, categories);
      this.isLoading.set(false);
      
      console.log('✅ Dashboard calculado com sucesso:', this.stats());
    } catch (error) {
      console.error('❌ Erro ao calcular dashboard:', error);
      this.isLoading.set(false);
    }
  }

  private calculateChartData(transactions: any[], categories: any[]) {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    
    if (expenseTransactions.length === 0) {
      this.chartData.set([]);
      return;
    }

    const categoryMap = categories.reduce((map, cat) => {
      map[cat.id] = cat.name;
      return map;
    }, {} as Record<string, string>);

    const expenseByCategory = expenseTransactions.reduce((acc, curr) => {
      const categoryName = categoryMap[curr.categoryId] || 'Outros';
      const amount = this.parseAmount(curr.amount);
      acc[categoryName] = (acc[categoryName] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(expenseByCategory).map(([name, value]) => ({
      name,
      value
    }));

    this.chartData.set(chartData);
  }

  private parseAmount(amount: any): number {
    if (typeof amount === 'number') return amount;
    if (typeof amount === 'string') {
      const cleaned = amount.replace(/[^\d,.-]/g, '').replace(',', '.');
      const parsed = parseFloat(cleaned);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }

  // Método para forçar recálculo
  refresh() {
    const transactions = this.transactionService.transactions();
    const categories = this.categoryService.categories();
    if (transactions.length > 0 && categories.length > 0) {
      this.calculateDashboardData(transactions, categories);
    }
  }
}