import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  DeleteCategoryDto,
} from '../models/category.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { ToastService } from './toast.service';
import { DialogService } from './dialog.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private dialogService = inject(DialogService);

  private baseUrl = `${environment.apiUrl}/categories`;

  private categoriesState = signal<Category[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  public categories = this.categoriesState.asReadonly();
  public loading = this.loadingState.asReadonly();
  public error = this.errorState.asReadonly();

  getCategoriesByUserId(userId?: string): Observable<Category[]> {
    const finalUserId = userId || this.authService.getCurrentUserId();

    if (!finalUserId) {
      this.errorState.set('Usuário não autenticado');
      this.toastService.error('Erro', 'Usuário não autenticado');
      return throwError(() => new Error('Usuário não autenticado'));
    }

    this.loadingState.set(true);
    this.errorState.set(null);

    const params = new HttpParams().set('userId', finalUserId);

    return this.http
      .get<Category[]>(`${this.baseUrl}/findByUserId`, {
        params,
        withCredentials: true,
      })
      .pipe(
        tap((categories) => {
          this.categoriesState.set(categories);
          this.loadingState.set(false);
        }),
        catchError((error) => {
          this.errorState.set('Erro ao carregar categorias');
          this.loadingState.set(false);
          this.toastService.error('Erro', 'Não foi possível carregar as categorias');
          return throwError(() => error);
        })
      );
  }

  createCategory(dto: CreateCategoryDto): Observable<any> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.toastService.error('Erro', 'Usuário não autenticado');
      return throwError(() => new Error('Usuário não autenticado'));
    }

    this.loadingState.set(true);

    const categoryData = {
      ...dto,
      userId,
    };

    return this.http
      .post(`${this.baseUrl}/create`, categoryData, { withCredentials: true })
      .pipe(
        tap((response: any) => {
          const currentCategories = this.categoriesState();
          this.categoriesState.set([...currentCategories, response.category]);
          this.loadingState.set(false);
          this.toastService.success('Sucesso!', 'Categoria criada com sucesso');
        }),
        catchError((error) => {
          this.loadingState.set(false);
          this.toastService.error('Erro', 'Não foi possível criar a categoria');
          return throwError(() => error);
        })
      );
  }

  updateCategory(dto: UpdateCategoryDto): Observable<any> {
    this.loadingState.set(true);
    
    return this.http
      .put(`${this.baseUrl}/update`, dto, { withCredentials: true })
      .pipe(
        tap((response: any) => {
          const currentCategories = this.categoriesState();
          const updatedCategories = currentCategories.map((category) =>
            category.id === response.category.id ? response.category : category
          );
          this.categoriesState.set(updatedCategories);
          this.loadingState.set(false);
          this.toastService.success('Sucesso!', 'Categoria atualizada com sucesso');
        }),
        catchError((error) => {
          this.loadingState.set(false);
          this.toastService.error('Erro', 'Não foi possível atualizar a categoria');
          return throwError(() => error);
        })
      );
  }

  async deleteCategory(id: string): Promise<void> {
    const confirmed = await this.dialogService.confirm({
      title: 'Excluir Categoria',
      message: 'Tem certeza que deseja excluir esta categoria? As transações associadas ficarão sem categoria.',
      type: 'warning',
      confirmText: 'Excluir',
      cancelText: 'Cancelar'
    });

    if (!confirmed) {
      return;
    }

    this.loadingState.set(true);

    const body: DeleteCategoryDto = { id };
    this.http
      .delete(`${this.baseUrl}/delete`, { body, withCredentials: true })
      .pipe(
        tap(() => {
          const currentCategories = this.categoriesState();
          const filteredCategories = currentCategories.filter(
            (category) => category.id !== id
          );
          this.categoriesState.set(filteredCategories);
          this.loadingState.set(false);
          this.toastService.success('Sucesso!', 'Categoria excluída com sucesso');
        }),
        catchError((error) => {
          this.loadingState.set(false);
          this.toastService.error('Erro', 'Não foi possível excluir a categoria');
          return throwError(() => error);
        })
      )
      .subscribe();
  }
  
  getCategoryById(id: string): Observable<Category> {
    const params = new HttpParams().set('id', id);
    return this.http.get<Category>(`${this.baseUrl}/findById`, {
      params,
      withCredentials: true,
    }).pipe(
      catchError((error) => {
        this.toastService.error('Erro', 'Não foi possível carregar a categoria');
        return throwError(() => error);
      })
    );
  }

  loadCategories(userId?: string) {
    this.getCategoriesByUserId(userId).subscribe();
  }

  clearCategories(): void {
    this.categoriesState.set([]);
    this.errorState.set(null);
  }
}