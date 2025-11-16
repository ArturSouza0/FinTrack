import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storage: Storage | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.storage = localStorage;
    }
  }

  setItem(key: string, value: any): void {
    if (!this.storage) return;

    try {
      const serializedValue = JSON.stringify(value);
      this.storage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  getItem<T>(key: string): T | null {
    if (!this.storage) return null;

    try {
      const item = this.storage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  }

  removeItem(key: string): void {
    if (!this.storage) return;
    this.storage.removeItem(key);
  }

  clear(): void {
    if (!this.storage) return;
    this.storage.clear();
  }

  setAccessToken(token: string): void {
    this.setItem('access_token', token);
  }

  getAccessToken(): string | null {
    return this.getItem<string>('access_token');
  }

  setRefreshToken(token: string): void {
    this.setItem('refresh_token', token);
  }

  getRefreshToken(): string | null {
    return this.getItem<string>('refresh_token');
  }

  setUser(user: any): void {
    this.setItem('current_user', user);
  }

  getUser(): any {
    return this.getItem('current_user');
  }

  clearAuth(): void {
    this.removeItem('access_token');
    this.removeItem('refresh_token');
    this.removeItem('current_user');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}
