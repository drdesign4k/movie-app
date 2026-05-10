import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OmdbService } from '../../core/services/omdb';
import { AuthService } from '../../core/services/auth';
import { MovieSummary } from '../../core/models/movie.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  private router = inject(Router);
  private omdbService = inject(OmdbService);
  authService = inject(AuthService);

  searchQuery = '';
  trendingMovies = signal<MovieSummary[]>([]);
  loadingTrending = signal(true);

  categories = [
    { label: 'Action', icon: '💥', query: 'action' },
    { label: 'Comédie', icon: '😂', query: 'comedy' },
    { label: 'Horreur', icon: '👻', query: 'horror' },
    { label: 'Science-Fiction', icon: '🚀', query: 'science fiction' },
    { label: 'Animation', icon: '🎨', query: 'animation' },
    { label: 'Thriller', icon: '🔪', query: 'thriller' },
    { label: 'Romance', icon: '❤️', query: 'romance' },
    { label: 'Documentaire', icon: '🎥', query: 'documentary' },
  ];

  stats = [
    { value: '500K+', label: 'Films & Séries' },
    { value: '100%', label: 'Gratuit' },
    { value: '24/7', label: 'Disponible' },
  ];

  ngOnInit() {
    this.loadTrending();
  }

  loadTrending() {
    this.loadingTrending.set(true);
    this.omdbService.searchMovies({ query: 'marvel', page: 1 });
    setTimeout(() => {
      this.trendingMovies.set(this.omdbService.movies().slice(0, 6));
      this.loadingTrending.set(false);
    }, 1500);
  }

  onSearch() {
    if (!this.searchQuery.trim()) return;
    this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
  }

  goToSearch(query: string) {
    this.router.navigate(['/search'], { queryParams: { q: query } });
  }

  goToDetail(imdbID: string) {
    this.router.navigate(['/movie', imdbID]);
  }
}
