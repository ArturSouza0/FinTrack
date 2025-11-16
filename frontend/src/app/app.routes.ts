// app.routes.ts
import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { AuthGuard, PublicGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Rotas Públicas (sem layout)
  {
    path: '',
    canActivate: [PublicGuard],
    loadComponent: () =>
      import('./pages/welcome/welcome').then(
        (m) => m.Welcome
      ),
  },
  {
    path: 'welcome',
    canActivate: [PublicGuard],
    loadComponent: () =>
      import('./pages/welcome/welcome').then(
        (m) => m.Welcome
      ),
  },
  {
    path: 'login',
    canActivate: [PublicGuard],
    loadComponent: () =>
      import('./pages/login/login').then((m) => m.Login),
  },


  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'transactions',
        loadComponent: () =>
          import('./pages/transactions/transactions').then(
            (m) => m.Transactions
          ),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./pages/categories/categories').then((m) => m.Categories),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./pages/reports/reports').then(
            (m) => m.Reports
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  {
    path: '**',
    redirectTo: 'welcome',
  },
];
