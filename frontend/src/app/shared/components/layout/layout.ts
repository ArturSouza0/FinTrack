import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Wallet, LayoutDashboard, List, Shapes, FileText, LogOut } from 'lucide-angular';

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
    LucideAngularModule 
  ],
  templateUrl: './layout.html'
})
export class LayoutComponent {
  currentPageName = input<string>('Dashboard');

  readonly walletIcon = Wallet;
  readonly dashboardIcon = LayoutDashboard;
  readonly listIcon = List;
  readonly shapesIcon = Shapes;
  readonly fileTextIcon = FileText;
  readonly logoutIcon = LogOut;

  navigationItems: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: this.dashboardIcon },
    { name: 'Transações', href: '/transactions', icon: this.listIcon },
    { name: 'Categorias', href: '/categories', icon: this.shapesIcon },
    { name: 'Relatórios', href: '/reports', icon: this.fileTextIcon },
  ];

  handleLogout() {
    console.log('Logout clicked');
    // Implementar lógica de logout aqui
  }
}