import { Component, input } from '@angular/core';
import { LucideAngularModule, Loader2 } from 'lucide-angular';

@Component({
  selector: 'app-loading',
  imports: [LucideAngularModule],
  templateUrl: './loading.component.html',
})
export class LoadingComponent {
  message = input<string>('');
  fullscreen = input<boolean>(false);
  size = input<number>(24);

  readonly loaderIcon = Loader2;

  containerClasses = () => {
    const baseClasses = 'flex items-center justify-center p-8';
    return this.fullscreen()
      ? `${baseClasses} fixed inset-0 bg-black/80 z-50`
      : baseClasses;
  };
}
