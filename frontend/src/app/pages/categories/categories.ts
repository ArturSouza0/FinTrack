import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../core/services/category.service';
import { CategoryFormComponent } from '../../shared/components/category-form/category-form.component';
import { LucideAngularModule } from 'lucide-angular';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Shapes,
} from 'lucide-angular';
import { Category } from '../../core/models/category.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, CategoryFormComponent],
  templateUrl: './categories.html',
})
export class Categories implements OnInit {
  private categoryService = inject(CategoryService);
  private authService = inject(AuthService);

  showForm = signal(false);
  editingCategory = signal<Category | null>(null);

  readonly trendingUpIcon = TrendingUp;
  readonly trendingDownIcon = TrendingDown;
  readonly plusIcon = Plus;
  readonly pencilIcon = Pencil;
  readonly trashIcon = Trash2;
  readonly loaderIcon = Loader2;
  readonly shapesIcon = Shapes;

  categories = computed(() => this.categoryService.categories());
  loading = computed(() => this.categoryService.loading());
  error = computed(() => this.categoryService.error());

  incomeCategories = computed(() =>
    this.categories()
      .filter((cat) => cat.type === 'income')
      .sort((a, b) => a.name.localeCompare(b.name))
  );

  expenseCategories = computed(() =>
    this.categories()
      .filter((cat) => cat.type === 'expense')
      .sort((a, b) => a.name.localeCompare(b.name))
  );

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    const userId = this.getCurrentUserId();
    if (userId) {
      this.categoryService.loadCategories(userId);
    }
  }

  openCreateForm() {
    this.editingCategory.set(null);
    this.showForm.set(true);
  }

  openEditForm(category: Category) {
    this.editingCategory.set(category);
    this.showForm.set(true);
  }

  onFormClose(open: boolean) {
    this.showForm.set(open);
    if (!open) {
      this.editingCategory.set(null);
    }
  }

  onCategorySave(categoryData: any) {
    if (categoryData.id) {
      this.categoryService
        .updateCategory({
          id: categoryData.id,
          name: categoryData.name,
          type: categoryData.type,
        })
        .subscribe({
          next: () => console.log('Categoria atualizada com sucesso'),
          error: (error) =>
            console.error('Erro ao atualizar categoria:', error),
        });
    } else {
      this.categoryService
        .createCategory({
          name: categoryData.name,
          type: categoryData.type,
          userId: this.getCurrentUserId(),
        })
        .subscribe({
          next: () => console.log('Categoria criada com sucesso'),
          error: (error) => console.error('Erro ao criar categoria:', error),
        });
    }
  }

async deleteCategory(id: string) {
    try {
      await this.categoryService.deleteCategory(id);
    } catch (error: any) {
      console.error('Erro ao excluir categoria:', error);
    }
  }

  getCategoryIcon(type: 'income' | 'expense') {
    return type === 'income' ? this.trendingUpIcon : this.trendingDownIcon;
  }

  getCategoryColor(type: 'income' | 'expense'): string {
    return type === 'income' ? 'text-emerald-500' : 'text-red-500';
  }

  private getCurrentUserId(): string | null {
    return this.authService.getCurrentUserId();
  }
}
