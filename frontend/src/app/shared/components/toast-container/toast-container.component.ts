import {
  Component,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  X,
} from 'lucide-angular';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './toast-container.component.html',
})
export class ToastContainerComponent {
  private toastService = inject(ToastService);

  toasts = computed(() => this.toastService.toasts());

  readonly xIcon = X;
  readonly checkIcon = CheckCircle;
  readonly errorIcon = XCircle;
  readonly warningIcon = AlertCircle;
  readonly infoIcon = Info;

  getIcon(type: string) {
    switch (type) {
      case 'success':
        return this.checkIcon;
      case 'error':
        return this.errorIcon;
      case 'warning':
        return this.warningIcon;
      case 'info':
        return this.infoIcon;
      default:
        return this.infoIcon;
    }
  }

  getToastClasses(type: string): string {
    const base = 'border';
    switch (type) {
      case 'success':
        return `${base} bg-green-950 border-green-800 text-green-400`;
      case 'error':
        return `${base} bg-red-950 border-red-800 text-red-400`;
      case 'warning':
        return `${base} bg-orange-950 border-orange-800 text-orange-400`;
      case 'info':
        return `${base} bg-blue-950 border-blue-800 text-blue-400`;
      default:
        return `${base} bg-gray-950 border-gray-800 text-gray-400`;
    }
  }

  dismissToast(id: number): void {
    this.toastService.dismiss(id);
  }
}
