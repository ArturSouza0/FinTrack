import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import {
  Plus,
  Loader2,
  TrendingUp,
  TrendingDown,
  Pencil,
  Trash2,
  List,
} from 'lucide-angular';
import { TransactionService } from '../../core/services/transaction.service';
import { CategoryService } from '../../core/services/category.service';

import { TransactionFormComponent } from '../../shared/components/transaction-form/transaction-form.component';
import { Transaction } from '../../core/models/transaction.model';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, TransactionFormComponent],
  templateUrl: './transactions.html',
})
export class Transactions implements OnInit {
  transactionService = inject(TransactionService);
  private categoryService = inject(CategoryService);

  showForm = signal(false);
  editingTransaction = signal<Transaction | null>(null);

  readonly plusIcon = Plus;
  readonly loaderIcon = Loader2;
  readonly trendingUpIcon = TrendingUp;
  readonly trendingDownIcon = TrendingDown;
  readonly pencilIcon = Pencil;
  readonly trashIcon = Trash2;
  readonly listIcon = List;

  categories = computed(() => this.categoryService.categories());

  ngOnInit() {
    this.loadTransactions();
    this.loadCategories();
  }

  loadTransactions() {
    const userId = this.getCurrentUserId();
    if (userId) {
      this.transactionService.getTransactionsByUserId(userId).subscribe();
    }
  }

  loadCategories() {
    const userId = this.getCurrentUserId();
    if (userId) {
      this.categoryService.loadCategories(userId);
    }
  }

  openCreateForm() {
    this.editingTransaction.set(null);
    this.showForm.set(true);
  }

  openEditForm(transaction: Transaction) {
    this.editingTransaction.set(transaction);
    this.showForm.set(true);
  }

  onFormClose(open: boolean) {
    this.showForm.set(open);
    if (!open) {
      this.editingTransaction.set(null);
    }
  }

  onTransactionSave(transactionData: any) {
    if (transactionData.id) {
      // Update existing transaction - passa um objeto UpdateTransactionDto
      const updateData = {
        id: transactionData.id,
        title: transactionData.title,
        amount: transactionData.amount,
        type: transactionData.type,
        date: transactionData.date,
        categoryId: transactionData.categoryId,
      };
      this.transactionService.updateTransaction(updateData).subscribe({
        next: () => console.log('Transação atualizada com sucesso'),
        error: (error) => console.error('Erro ao atualizar transação:', error),
      });
    } else {
      // Create new transaction
      this.transactionService
        .createTransaction({
          title: transactionData.title,
          amount: transactionData.amount,
          type: transactionData.type,
          date: transactionData.date,
          categoryId: transactionData.categoryId,
          userId: this.getCurrentUserId(),
        })
        .subscribe({
          next: () => console.log('Transação criada com sucesso'),
          error: (error) => console.error('Erro ao criar transação:', error),
        });
    }
  }

  deleteTransaction(id: string) {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      this.transactionService.deleteTransaction(id).subscribe({
        next: () => console.log('Transação excluída com sucesso'),
        error: (error) => console.error('Erro ao excluir transação:', error),
      });
    }
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories().find((cat) => cat.id === categoryId);
    return category?.name || 'Sem categoria';
  }

  getCategoryIcon(type: 'income' | 'expense') {
    return type === 'income' ? this.trendingUpIcon : this.trendingDownIcon;
  }

  getCategoryColor(type: 'income' | 'expense'): string {
    return type === 'income' ? 'text-emerald-500' : 'text-red-500';
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

  private getCurrentUserId(): string {
    // Implemente de acordo com sua lógica de autenticação
    return '300d01da-910b-45f0-a3db-d75e35b5c503';
  }
}
