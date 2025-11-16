import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  NavigationEnd,
} from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import {
  Wallet,
  LayoutDashboard,
  List,
  Shapes,
  FileText,
  LogOut,
  User,
} from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ToastContainerComponent } from '../toast-container/toast-container.component';

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LucideAngularModule,
    ConfirmDialogComponent,
    ToastContainerComponent,
  ],
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private routerSubscription!: Subscription;

  currentPageName = 'Dashboard';
  user = this.authService.user;

  readonly walletIcon = Wallet;
  readonly dashboardIcon = LayoutDashboard;
  readonly listIcon = List;
  readonly shapesIcon = Shapes;
  readonly fileTextIcon = FileText;
  readonly logoutIcon = LogOut;
  readonly userIcon = User;

  navigationItems: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: this.dashboardIcon },
    { name: 'Transações', href: '/transactions', icon: this.listIcon },
    { name: 'Categorias', href: '/categories', icon: this.shapesIcon },
    { name: 'Relatórios', href: '/reports', icon: this.fileTextIcon },
  ];

  ngOnInit() {
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updatePageTitle();
      });

    this.updatePageTitle();
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private updatePageTitle() {
    const currentRoute = this.router.url;

    if (currentRoute.includes('/dashboard')) {
      this.currentPageName = 'Dashboard';
    } else if (currentRoute.includes('/transactions')) {
      this.currentPageName = 'Transações';
    } else if (currentRoute.includes('/categories')) {
      this.currentPageName = 'Categorias';
    } else if (currentRoute.includes('/reports')) {
      this.currentPageName = 'Relatórios';
    } else {
      this.currentPageName = 'Dashboard';
    }
  }

  handleLogout() {
    this.authService.logout();
  }
}