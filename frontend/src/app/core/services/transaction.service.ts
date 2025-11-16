import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import {
  Transaction,
  CreateTransactionDto,
  UpdateTransactionDto,
} from '../models/transaction.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { ToastService } from './toast.service';
import { DialogService } from './dialog.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private dialogService = inject(DialogService);

  private baseUrl = `${environment.apiUrl}/transactions`;

  private transactionsState = signal<Transaction[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  public transactions = this.transactionsState.asReadonly();
  public loading = this.loadingState.asReadonly();
  public error = this.errorState.asReadonly();

  getTransactionsByUserId(userId?: string): Observable<Transaction[]> {
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
      .get<Transaction[]>(`${this.baseUrl}/findByUserId`, {
        params,
        withCredentials: true,
      })
      .pipe(
        tap((transactions) => {
          this.transactionsState.set(transactions);
          this.loadingState.set(false);
        }),
        catchError((error) => {
          this.errorState.set('Erro ao carregar transações');
          this.loadingState.set(false);
          this.toastService.error('Erro', 'Não foi possível carregar as transações');
          return throwError(() => error);
        })
      );
  }

  createTransaction(dto: CreateTransactionDto): Observable<any> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.toastService.error('Erro', 'Usuário não autenticado');
      return throwError(() => new Error('Usuário não autenticado'));
    }

    this.loadingState.set(true);

    const transactionData = {
      ...dto,
      userId,
    };

    return this.http
      .post(`${this.baseUrl}/create`, transactionData, {
        withCredentials: true,
      })
      .pipe(
        tap((response: any) => {
          const currentTransactions = this.transactionsState();
          this.transactionsState.set([
            response.transaction,
            ...currentTransactions,
          ]);
          this.loadingState.set(false);
          this.toastService.success('Sucesso!', 'Transação criada com sucesso');
        }),
        catchError((error) => {
          this.loadingState.set(false);
          this.toastService.error('Erro', 'Não foi possível criar a transação');
          return throwError(() => error);
        })
      );
  }

  updateTransaction(dto: UpdateTransactionDto): Observable<any> {
    this.loadingState.set(true);
    
    return this.http
      .put(`${this.baseUrl}/update`, dto, {
        withCredentials: true,
      })
      .pipe(
        tap((response: any) => {
          const currentTransactions = this.transactionsState();
          const updatedTransactions = currentTransactions.map((transaction) =>
            transaction.id === response.transaction.id
              ? response.transaction
              : transaction
          );
          this.transactionsState.set(updatedTransactions);
          this.loadingState.set(false);
          this.toastService.success('Sucesso!', 'Transação atualizada com sucesso');
        }),
        catchError((error) => {
          this.loadingState.set(false);
          this.toastService.error('Erro', 'Não foi possível atualizar a transação');
          return throwError(() => error);
        })
      );
  }

  async deleteTransaction(id: string): Promise<void> {
    const confirmed = await this.dialogService.confirm({
      title: 'Excluir Transação',
      message: 'Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.',
      type: 'danger',
      confirmText: 'Excluir',
      cancelText: 'Cancelar'
    });

    if (!confirmed) {
      return;
    }

    this.loadingState.set(true);

    this.http
      .delete(`${this.baseUrl}/delete`, { body: { id }, withCredentials: true })
      .pipe(
        tap(() => {
          const currentTransactions = this.transactionsState();
          const filteredTransactions = currentTransactions.filter(
            (transaction) => transaction.id !== id
          );
          this.transactionsState.set(filteredTransactions);
          this.loadingState.set(false);
          this.toastService.success('Sucesso!', 'Transação excluída com sucesso');
        }),
        catchError((error) => {
          this.loadingState.set(false);
          this.toastService.error('Erro', 'Não foi possível excluir a transação');
          return throwError(() => error);
        })
      )
      .subscribe();
  }

  getTransactionById(id: string): Observable<Transaction> {
    const params = new HttpParams().set('id', id);
    return this.http.get<Transaction>(`${this.baseUrl}/findById`, {
      params,
      withCredentials: true,
    }).pipe(
      catchError((error) => {
        this.toastService.error('Erro', 'Não foi possível carregar a transação');
        return throwError(() => error);
      })
    );
  }

  getTransactionsByCategoryId(categoryId: string): Observable<Transaction[]> {
    const params = new HttpParams().set('categoryId', categoryId);
    return this.http.get<Transaction[]>(`${this.baseUrl}/findByCategoryId`, {
      params,
      withCredentials: true,
    }).pipe(
      catchError((error) => {
        this.toastService.error('Erro', 'Não foi possível carregar as transações da categoria');
        return throwError(() => error);
      })
    );
  }

  loadTransactions(userId?: string) {
    this.getTransactionsByUserId(userId).subscribe();
  }

  clearTransactions(): void {
    this.transactionsState.set([]);
    this.errorState.set(null);
  }
}