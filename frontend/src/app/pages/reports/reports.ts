import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Download } from 'lucide-angular';
import { TransactionService } from '../../core/services/transaction.service';
import { CategoryService } from '../../core/services/category.service';
import { Formatters } from '../../shared/utils/formatters';

interface ReportFilters {
  startDate: string;
  endDate: string;
  type: 'all' | 'income' | 'expense';
  category: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './reports.html',
})
export class Reports implements OnInit {
  private transactionService = inject(TransactionService);
  private categoryService = inject(CategoryService);

  readonly downloadIcon = Download;

  filters = signal<ReportFilters>({
    startDate: this.getFirstDayOfMonth(),
    endDate: new Date().toISOString().split('T')[0],
    type: 'all',
    category: 'all',
  });

  transactions = this.transactionService.transactions;
  categories = this.categoryService.categories;

  filteredTransactions = computed(() => {
    const { startDate, endDate, type, category } = this.filters();

    return this.transactions().filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const start = new Date(startDate);
      const end = new Date(endDate);

      const dateMatch = transactionDate >= start && transactionDate <= end;
      const typeMatch = type === 'all' || transaction.type === type;
      const categoryMatch =
        category === 'all' || transaction.categoryId === category;

      return dateMatch && typeMatch && categoryMatch;
    });
  });

  reportSummary = computed(() => {
    const transactions = this.filteredTransactions();

    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    return {
      totalIncome,
      totalExpenses,
      balance,
      transactionCount: transactions.length,
    };
  });

  categoryBreakdown = computed(() => {
    const transactions = this.filteredTransactions();
    const breakdown: {
      [key: string]: { amount: number; count: number; name: string };
    } = {};

    transactions.forEach((transaction) => {
      const category = this.categories().find(
        (c) => c.id === transaction.categoryId
      );
      const categoryName = category?.name || 'Sem Categoria';

      if (!breakdown[categoryName]) {
        breakdown[categoryName] = { amount: 0, count: 0, name: categoryName };
      }

      breakdown[categoryName].amount += transaction.amount;
      breakdown[categoryName].count += 1;
    });

    return Object.values(breakdown).sort((a, b) => b.amount - a.amount);
  });

  ngOnInit() {
    this.transactionService.loadTransactions();
    this.categoryService.loadCategories();
  }

  private getFirstDayOfMonth(): string {
    const date = new Date();
    date.setDate(1);
    return date.toISOString().split('T')[0];
  }

  updateFilter(field: keyof ReportFilters, event: Event) {
    const value = (event.target as HTMLInputElement | HTMLSelectElement).value;
    this.filters.update((filters) => ({ ...filters, [field]: value as any }));
  }

  exportToCSV() {
    const transactions = this.filteredTransactions();
    const headers = ['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor'];
    const csvData = transactions.map((t) => [
      Formatters.formatDate(t.date),
      `"${t.title.replace(/"/g, '""')}"`,
      this.categories().find((c) => c.id === t.categoryId)?.name ||
        'Sem Categoria',
      t.type === 'income' ? 'Receita' : 'Despesa',
      Formatters.formatCurrency(t.amount),
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `relatorio-fintrack-${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  formatCurrency = Formatters.formatCurrency;
}
