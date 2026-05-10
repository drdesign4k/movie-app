import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { HistoryEntry } from '../models/history.model';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class HistoryService {
  http = inject(HttpClient);
  private authService = inject(AuthService);

  history = signal<HistoryEntry[]>([]);
  loading = signal(false);

  addToHistory(entry: { imdbID: string; title: string; poster: string }): void {
    if (!this.authService.isLoggedIn()) return;
    this.http.post<HistoryEntry>(`${environment.apiUrl}/history`, entry).subscribe({
      error: (err) => console.error('Erreur ajout historique', err)
    });
  }

  loadHistory(): void {
    if (!this.authService.isLoggedIn()) return;
    this.loading.set(true);
    this.http.get<HistoryEntry[]>(`${environment.apiUrl}/history`).subscribe({
      next: (data) => {
        this.history.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement historique', err);
        this.loading.set(false);
      }
    });
  }

  clearHistory() {
    return this.http.delete(`${environment.apiUrl}/history`);
  }
}
