import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Category, CreateCategoryDto, UpdateCategoryDto, DeleteCategoryDto } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})

export class CategoryService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/categories';

  private categoriesState = signal<Category[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  public categories = this.categoriesState.asReadonly();
  public loading = this.loadingState.asReadonly();
  public error = this.errorState.asReadonly();

  // Buscar categorias por usuário (GET com query parameters)
  getCategoriesByUserId(userId: string): Observable<Category[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    const params = new HttpParams().set('userId', userId);

    return this.http.get<Category[]>(`${this.baseUrl}/findByUserId`, { params }).pipe(
      tap((categories) => {
        this.categoriesState.set(categories);
        this.loadingState.set(false);
      }),
      catchError((error) => {
        this.errorState.set('Erro ao carregar categorias');
        this.loadingState.set(false);
        return throwError(() => error);
      })
    );
  }

  // Buscar categoria por ID (GET com query parameters)
  getCategoryById(id: string): Observable<Category> {
    const params = new HttpParams().set('id', id);
    return this.http.get<Category>(`${this.baseUrl}/findById`, { params });
  }

  // Criar categoria
  createCategory(dto: CreateCategoryDto): Observable<any> {
    this.loadingState.set(true);
    return this.http.post(`${this.baseUrl}/create`, dto).pipe(
      tap((response: any) => {
        // Atualizar a lista de categorias com a nova
        const currentCategories = this.categoriesState();
        this.categoriesState.set([...currentCategories, response.category]);
        this.loadingState.set(false);
      }),
      catchError((error) => {
        this.loadingState.set(false);
        return throwError(() => error);
      })
    );
  }

  // Atualizar categoria
  updateCategory(dto: UpdateCategoryDto): Observable<any> {
    return this.http.put(`${this.baseUrl}/update`, dto).pipe(
      tap((response: any) => {
        // Atualizar a categoria na lista
        const currentCategories = this.categoriesState();
        const updatedCategories = currentCategories.map(category =>
          category.id === response.category.id ? response.category : category
        );
        this.categoriesState.set(updatedCategories);
      })
    );
  }

  // Deletar categoria
  deleteCategory(id: string): Observable<any> { 
    const body: DeleteCategoryDto = { id };
    return this.http.delete(`${this.baseUrl}/delete`, { body }).pipe(
      tap(() => {
        // Remover a categoria da lista
        const currentCategories = this.categoriesState();
        const filteredCategories = currentCategories.filter(category => category.id !== id);
        this.categoriesState.set(filteredCategories);
      })
    );
  }

  // Carregar categorias (método conveniente)
  loadCategories(userId: string) {
    this.getCategoriesByUserId(userId).subscribe();
  }

  // Limpar estado
  clearCategories(): void {
    this.categoriesState.set([]);
    this.errorState.set(null);
  }
}