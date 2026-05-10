import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe } from '@angular/common';
import { HistoryService } from '../../core/services/history';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule, DatePipe, RouterLink],
  templateUrl: './history.html',
  styleUrl: './history.scss'
})
export class History implements OnInit {
  historyService = inject(HistoryService);
  authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.historyService.loadHistory();
  }

  goToDetail(imdbID: string) {
    this.router.navigate(['/movie', imdbID]);
  }

  clearHistory() {
    this.historyService.clearHistory().subscribe({
      next: () => this.historyService.history.set([]),
      error: (err) => console.error(err)
    });
  }
}
