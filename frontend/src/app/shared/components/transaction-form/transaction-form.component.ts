import { Component, input, output, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { Plus, TrendingUp, TrendingDown } from 'lucide-angular';
import { CategoryService } from '../../../core/services/category.service';
import { Transaction } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-transaction-form',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './transaction-form.component.html'
})
export class TransactionFormComponent {
  private categoryService = inject(CategoryService);

  open = input.required<boolean>();
  transaction = input<Transaction | null>(null);
  openChange = output<boolean>();
  onSave = output<any>();

  readonly plusIcon = Plus;
  readonly trendingUpIcon = TrendingUp;
  readonly trendingDownIcon = TrendingDown;

  formData = signal({
    title: '',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    date: new Date().toISOString().split('T')[0],
    categoryId: ''
  });

  errors = signal<Record<string, string>>({});

  // Computed
  categories = this.categoryService.categories;
  filteredCategories = () => this.categories().filter(cat => cat.type === this.formData().type);

  constructor() {
    effect(() => {
      if (this.open()) {
        this.resetForm();
      }
    });
  }

  private resetForm() {
    const transaction = this.transaction();
    if (transaction) {
      this.formData.set({
        title: transaction.title,
        amount: transaction.amount.toString(),
        type: transaction.type,
        date: transaction.date.split('T')[0],
        categoryId: transaction.categoryId
      });
    } else {
      this.formData.set({
        title: '',
        amount: '',
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
        categoryId: ''
      });
    }
    this.errors.set({});
  }

  setType(type: 'income' | 'expense') {
    this.formData.update(prev => ({ ...prev, type, categoryId: '' }));
  }

  validate(): boolean {
    const newErrors: Record<string, string> = {};
    const data = this.formData();

    if (!data.title.trim()) {
      newErrors['title'] = "Título é obrigatório";
    }

    if (!data.amount || parseFloat(data.amount) <= 0) {
      newErrors['amount'] = "Valor deve ser maior que zero";
    }

    if (!data.categoryId) {
      newErrors['categoryId'] = "Categoria é obrigatória";
    }

    if (!data.date) {
      newErrors['date'] = "Data é obrigatória";
    }

    this.errors.set(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  submit() {
    if (!this.validate()) return;

    const dataToSave = {
      ...this.formData(),
      amount: parseFloat(this.formData().amount),
      date: this.formData().date
    };

    this.onSave.emit({ 
      ...this.transaction(), 
      ...dataToSave 
    });
    this.close();
  }

  close() {
    this.openChange.emit(false);
  }
}