import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';

import { Transaction, CreateTransactionDto, UpdateTransactionDto, } from '../models/transaction.model';
@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/transactions';

  // Signals para estado reativo
  private transactionsState = signal<Transaction[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // Expor signals como read-only
  public transactions = this.transactionsState.asReadonly();
  public loading = this.loadingState.asReadonly();
  public error = this.errorState.asReadonly();

  // Buscar transações por usuário (GET com query parameters)
  getTransactionsByUserId(userId: string): Observable<Transaction[]> {
    this.loadingState.set(true);
    this.errorState.set(null);

    const params = new HttpParams().set('userId', userId);

    return this.http
      .get<Transaction[]>(`${this.baseUrl}/findByUserId`, { params })
      .pipe(
        tap((transactions) => {
          this.transactionsState.set(transactions);
          this.loadingState.set(false);
          console.log(transactions);
        }),
        catchError((error) => {
          this.errorState.set('Erro ao carregar transações');
          this.loadingState.set(false);
          return throwError(() => error);
        })
      );
  }

  // Buscar transação por ID (GET com query parameters)
  getTransactionById(id: string): Observable<Transaction> {
    const params = new HttpParams().set('id', id);
    return this.http.get<Transaction>(`${this.baseUrl}/findById`, { params });
  }

  // Buscar transações por categoria (GET com query parameters)
  getTransactionsByCategoryId(categoryId: string): Observable<Transaction[]> {
    const params = new HttpParams().set('categoryId', categoryId);
    return this.http.get<Transaction[]>(`${this.baseUrl}/findByCategoryId`, { params });
  }

  // Criar transação
  createTransaction(dto: CreateTransactionDto): Observable<any> {
    this.loadingState.set(true);
    return this.http.post(`${this.baseUrl}/create`, dto).pipe(
      tap((response: any) => {
        const currentTransactions = this.transactionsState();
        this.transactionsState.set([
          response.transaction,
          ...currentTransactions,
        ]);
        this.loadingState.set(false);
      }),
      catchError((error) => {
        this.loadingState.set(false);
        return throwError(() => error);
      })
    );
  }

  // Atualizar transação
  updateTransaction(dto: UpdateTransactionDto): Observable<any> {
    return this.http.put(`${this.baseUrl}/update`, dto).pipe(
      tap((response: any) => {
        const currentTransactions = this.transactionsState();
        const updatedTransactions = currentTransactions.map((transaction) =>
          transaction.id === response.transaction.id
            ? response.transaction
            : transaction
        );
        this.transactionsState.set(updatedTransactions);
      })
    );
  }

  // Deletar transação
  deleteTransaction(id: string): Observable<any> {
    return this.http
      .delete(`${this.baseUrl}/delete`, {
        body: { id },
      })
      .pipe(
        tap(() => {
          const currentTransactions = this.transactionsState();
          const filteredTransactions = currentTransactions.filter(
            (transaction) => transaction.id !== id
          );
          this.transactionsState.set(filteredTransactions);
        })
      );
  }

  // Limpar estado
  clearTransactions(): void {
    this.transactionsState.set([]);
    this.errorState.set(null);
  }
}