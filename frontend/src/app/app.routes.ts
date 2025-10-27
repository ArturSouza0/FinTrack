// app.routes.ts
import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
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
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    ],
  },
];
