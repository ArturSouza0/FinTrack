import { Component, inject, signal, DestroyRef, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LucideAngularModule, Wallet } from 'lucide-angular';
import { Mail, Lock, LogIn, Eye, EyeOff, UserPlus } from 'lucide-angular';

import { AuthService } from '../../core/services/auth.service';
import { LoginRequest } from '../../core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './login.html',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  readonly mailIcon = Mail;
  readonly lockIcon = Lock;
  readonly loginIcon = LogIn;
  readonly eyeIcon = Eye;
  readonly eyeOffIcon = EyeOff;
  readonly userPlusIcon = UserPlus;
  readonly walletIcon = Wallet;

  credentials = signal<LoginRequest>({
    email: '',
    password: '',
  });

  showPassword = signal(false);
  isLoading = this.authService.isLoading;
  localError = signal<string | null>(null);
  error = computed(() => this.authService.error() || this.localError());
  isRegistering = signal(false);

  onSubmit() {
    this.localError.set(null);

    if (this.isRegistering()) {
      this.register();
    } else {
      this.login();
    }
  }

  login() {
    this.authService
      .login(this.credentials())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Erro no login:', error);
        },
      });
  }

  register() {
    const registerData = {
      ...this.credentials(),
      name: this.credentials().email.split('@')[0],
    };

    if (registerData.password.length < 6) {
      this.localError.set('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    this.authService
      .register(registerData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          console.log('✅ Registro bem-sucedido:', response.message);
          this.login();
        },
        error: (error) => {
          console.error('Erro no registro:', error);
        },
      });
  }

  togglePasswordVisibility() {
    this.showPassword.update((show) => !show);
  }

  toggleMode() {
    this.isRegistering.update((mode) => !mode);
    this.localError.set(null);
  }

  quickLogin() {
    this.credentials.set({
      email: 'cleitin@gmail.com',
      password: 'senha123',
    });
    this.localError.set(null);
  }
}
