// pages/welcome/welcome.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ArrowRight, TrendingUp, Shield, BarChart3, Wallet } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './welcome.html'
})
export class Welcome {
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly arrowRightIcon = ArrowRight;
  readonly trendingUpIcon = TrendingUp;
  readonly shieldIcon = Shield;
  readonly barChartIcon = BarChart3;
  readonly walletIcon = Wallet;

  features = [
    {
      icon: this.trendingUpIcon,
      title: 'Controle Financeiro',
      description: 'Acompanhe receitas e despesas em tempo real'
    },
    {
      icon: this.barChartIcon,
      title: 'Relatórios Detalhados',
      description: 'Gráficos e insights sobre seus gastos'
    },
    {
      icon: this.shieldIcon,
      title: 'Seguro e Privado',
      description: 'Seus dados protegidos com criptografia'
    }
  ];

  quickStart() {
    // Se já estiver autenticado, vai direto para o dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}