import { Injectable, signal, computed } from '@angular/core';
import { Toast } from '../models/toast.model';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSignal = signal<Toast[]>([]);

  toasts = computed(() => this.toastsSignal());

  private nextId = 0;

  private addToast(toast: Omit<Toast, 'id' | 'createdAt'>): number {
    const id = this.nextId++;
    const newToast: Toast = {
      ...toast,
      id,
      createdAt: Date.now(),
    };

    this.toastsSignal.update((toasts) => [...toasts, newToast]);
    return id;
  }

  private removeToast(id: number): void {
    this.toastsSignal.update((toasts) =>
      toasts.filter((toast) => toast.id !== id)
    );
  }

  success(title: string, message?: string, duration: number = 4000): void {
    this.addToast({ type: 'success', title, message, duration });
    this.startAutoCleanup();
  }

  error(title: string, message?: string, duration: number = 4000): void {
    this.addToast({ type: 'error', title, message, duration });
    this.startAutoCleanup();
  }

  warning(title: string, message?: string, duration: number = 4000): void {
    this.addToast({ type: 'warning', title, message, duration });
    this.startAutoCleanup();
  }

  info(title: string, message?: string, duration: number = 4000): void {
    this.addToast({ type: 'info', title, message, duration });
    this.startAutoCleanup();
  }

  dismiss(id: number): void {
    this.removeToast(id);
  }

  clear(): void {
    this.toastsSignal.set([]);
  }

  private startAutoCleanup(): void {
    if (this.toasts().length === 1) {
      this.setupCleanupInterval();
    }
  }

  private setupCleanupInterval(): void {
    const interval = setInterval(() => {
      const now = Date.now();
      const toasts = this.toasts();

      if (toasts.length === 0) {
        clearInterval(interval);
        return;
      }

      const expiredToasts = toasts.filter((toast) => {
        const elapsed = now - toast.createdAt;
        return elapsed >= toast.duration;
      });

      if (expiredToasts.length > 0) {
        this.toastsSignal.update((currentToasts) =>
          currentToasts.filter((toast) => {
            const elapsed = now - toast.createdAt;
            return elapsed < toast.duration;
          })
        );
      }

      if (this.toasts().length === 0) {
        clearInterval(interval);
      }
    }, 100);
  }
}
