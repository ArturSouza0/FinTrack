// components/category-form/category-form.component.ts
import {
  Component,
  input,
  output,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { Info, Plus, TrendingUp, TrendingDown } from 'lucide-angular';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './category-form.component.html',
})
export class CategoryFormComponent {
  open = input.required<boolean>();
  category = input<Category | null>(null);
  openChange = output<boolean>();
  onSave = output<any>();

  // Usar as importações diretas do Lucide
  readonly infoIcon = Info;
  readonly plusIcon = Plus;
  readonly trendingUpIcon = TrendingUp;
  readonly trendingDownIcon = TrendingDown;

  formData = signal({
    name: '',
    type: 'expense' as 'income' | 'expense',
  });

  errors = signal<Record<string, string>>({});

  constructor() {
    effect(() => {
      if (this.open()) {
        this.resetForm();
      }
    });
  }

  private resetForm() {
    const category = this.category();
    if (category) {
      this.formData.set({
        name: category.name,
        type: category.type,
      });
    } else {
      this.formData.set({
        name: '',
        type: 'expense',
      });
    }
    this.errors.set({});
  }

  setType(type: 'income' | 'expense') {
    this.formData.update((prev) => ({ ...prev, type }));
  }

  validate(): boolean {
    const newErrors: Record<string, string> = {};
    const data = this.formData();

    if (!data.name.trim()) {
      newErrors['name'] = 'Nome é obrigatório';
    }

    if (data.name.trim().length < 2) {
      newErrors['name'] = 'Nome deve ter pelo menos 2 caracteres';
    }

    this.errors.set(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  submit() {
    if (!this.validate()) return;

    const dataToSave = {
      ...this.formData(),
    };

    this.onSave.emit({
      ...this.category(),
      ...dataToSave,
    });
    this.close();
  }

  close() {
    this.openChange.emit(false);
  }
}
