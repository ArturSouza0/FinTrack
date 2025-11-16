import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  AlertTriangle,
  X,
  Check,
  Ban,
} from 'lucide-angular';
import { DialogService } from '../../../core/services/dialog.service';
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  dialogService = inject(DialogService);

  readonly alertIcon = AlertTriangle;
  readonly xIcon = X;
  readonly checkIcon = Check;
  readonly banIcon = Ban;

  iconContainerClasses = () => {
    const base = 'flex items-center justify-center w-12 h-12 rounded-full';
    const type = this.dialogService.currentDialogData()?.type || 'warning';

    switch (type) {
      case 'danger':
        return `${base} bg-red-500/10 text-red-500`;
      case 'info':
        return `${base} bg-blue-500/10 text-blue-500`;
      case 'warning':
      default:
        return `${base} bg-orange-500/10 text-orange-500`;
    }
  };

  confirmButtonClasses = () => {
    const base =
      'flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors';
    const type = this.dialogService.currentDialogData()?.type || 'warning';

    switch (type) {
      case 'danger':
        return `${base} bg-red-600 hover:bg-red-700`;
      case 'info':
        return `${base} bg-blue-600 hover:bg-blue-700`;
      case 'warning':
      default:
        return `${base} bg-orange-600 hover:bg-orange-700`;
    }
  };

  onConfirm(): void {
    this.dialogService.close(true);
  }

  onCancel(): void {
    this.dialogService.close(false);
  }
}
