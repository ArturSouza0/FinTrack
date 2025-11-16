import { Injectable, inject, signal } from '@angular/core';
import { ConfirmDialogData } from '../models/dialog.model';


@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private isOpen = signal(false);
  private dialogData = signal<ConfirmDialogData | null>(null);
  private resolveFn: ((value: boolean) => void) | null = null;

  isDialogOpen = this.isOpen.asReadonly();
  currentDialogData = this.dialogData.asReadonly();

  async confirm(data: ConfirmDialogData): Promise<boolean> {
    this.dialogData.set(data);
    this.isOpen.set(true);

    return new Promise<boolean>((resolve) => {
      this.resolveFn = resolve;
    });
  }

  close(result: boolean): void {
    this.isOpen.set(false);
    this.dialogData.set(null);
    if (this.resolveFn) {
      this.resolveFn(result);
      this.resolveFn = null;
    }
  }
}
