// components/stat-cards/stat-cards.component.ts
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-angular';

export interface StatCard {
  title: string;
  value: string;
  icon: any;
  colorClass: string;
}

@Component({
  selector: 'app-stat-cards',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './start-cards.component.html',
})
export class StatCardsComponent {
  stats = input<StatCard[]>([]);
  isLoading = input(false);
}
