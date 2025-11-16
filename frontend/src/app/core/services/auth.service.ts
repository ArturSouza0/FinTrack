import {
  Injectable,
  inject,
  signal,
  computed,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap, throwError, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { ToastService } from './toast.service';
import { environment } from '../../environments/environment';
import { AuthState, RegisterRequest, RegisterResponse, LoginRequest, AuthResponse, User } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private storageService = inject(StorageService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private platformId = inject(PLATFORM_ID);

  private apiUrl = environment.apiUrl;

  private state = signal<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });

  user = computed(() => this.state().user);
  isAuthenticated = computed(() => this.state().isAuthenticated);
  isLoading = computed(() => this.state().isLoading);
  error = computed(() => this.state().error);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeAuth();
    }
  }

  private initializeAuth() {
    const accessToken = this.storageService.getAccessToken();
    const user = this.storageService.getUser();

    if (accessToken && user) {
      this.state.update((state) => ({
        ...state,
        user,
        isAuthenticated: true,
      }));
    }
  }

  register(registerData: RegisterRequest): Observable<RegisterResponse> {
    this.state.update((state) => ({ ...state, isLoading: true, error: null }));
    return this.http
      .post<RegisterResponse>(`${this.apiUrl}/auth/register`, registerData)
      .pipe(
        tap((response) => {
          this.state.update((state) => ({
            ...state,
            isLoading: false,
            error: null,
          }));
          this.toastService.success('Sucesso!', 'Conta criada com sucesso');
        }),
        catchError(this.handleError.bind(this))
      );
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    this.state.update((state) => ({ ...state, isLoading: true, error: null }));
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          this.handleLoginSuccess(response, credentials.email);
          this.toastService.success(
            'Bem-vindo!',
            'Login realizado com sucesso'
          );
        }),
        catchError(this.handleError.bind(this))
      );
  }

  private handleLoginSuccess(response: AuthResponse, email: string): void {
    if (isPlatformBrowser(this.platformId)) {
      this.storageService.setAccessToken(response.accessToken);

      const user: User = {
        id: this.extractUserIdFromToken(response.accessToken),
        email: email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString(),
      };

      this.storageService.setUser(user);

      this.state.update((state) => ({
        ...state,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }));
    }
  }

  logout(): void {
    const accessToken = this.getAccessToken();

    if (accessToken) {
      this.http
        .post(
          `${this.apiUrl}/auth/logout`,
          {},
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        )
        .subscribe({
          next: () => {
            this.completeLogout();
            this.toastService.info('Até logo!', 'Logout realizado com sucesso');
          },
          error: () => {
            this.completeLogout();
            this.toastService.info('Até logo!', 'Logout realizado');
          },
        });
    } else {
      this.completeLogout();
      this.toastService.info('Até logo!', 'Logout realizado');
    }
  }

  private completeLogout(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.storageService.clearAuth();
    }

    this.state.update((state) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    }));

    this.router.navigate(['/welcome']);
  }

  refreshTokens(): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${this.apiUrl}/auth/refresh`,
        {},
        {
          withCredentials: true,
          headers: {},
        }
      )
      .pipe(
        tap((tokens) => {
          if (isPlatformBrowser(this.platformId)) {
            this.storageService.setAccessToken(tokens.accessToken);
          }
          this.toastService.info(
            'Sessão renovada',
            'Tokens atualizados com sucesso'
          );
        }),
        catchError((error) => {
          this.toastService.error('Erro', 'Não foi possível renovar a sessão');
          this.logout();
          return throwError(() => error);
        })
      );
  }

  getAccessToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return this.storageService.getAccessToken();
    }
    return null;
  }

  private extractUserIdFromToken(token: string): string {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub;
    } catch {
      return 'unknown-user-id';
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Erro desconhecido';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 0) {
      errorMessage = 'Erro de conexão com o servidor';
    } else if (error.status === 401) {
      errorMessage = 'Credenciais inválidas';
    } else if (error.status === 409) {
      errorMessage = 'Usuário já existe';
    }

    this.state.update((state) => ({
      ...state,
      isLoading: false,
      error: errorMessage,
    }));

    this.toastService.error('Erro', errorMessage);

    return throwError(() => new Error(errorMessage));
  }

  getCurrentUserId(): string | null {
    return this.user()?.id || null;
  }
}
