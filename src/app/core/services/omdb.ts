import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MovieDetail, MovieSummary, SearchFilters, SearchResponse } from '../models/movie.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OmdbService {
  private http = inject(HttpClient);

  // ── Signals état global ──────────────────────────────
  movies = signal<MovieSummary[]>([]);
  totalResults = signal<number>(0);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Favoris (persistés dans localStorage)
  favorites = signal<MovieSummary[]>(this.loadFavorites());

  totalPages = computed(() => Math.ceil(this.totalResults() / 10));
  hasFavorites = computed(() => this.favorites().length > 0);

  // ── Recherche ────────────────────────────────────────
  searchMovies(filters: SearchFilters): void {
    this.loading.set(true);
    this.error.set(null);

    let params = new HttpParams()
      .set('apikey', environment.omdbApiKey)
      .set('s', filters.query)
      .set('page', filters.page.toString());

    if (filters.year) params = params.set('y', filters.year);
    if (filters.type) params = params.set('type', filters.type);

    this.http.get<SearchResponse>(environment.omdbBaseUrl, { params }).subscribe({
      next: (res) => {
        if (res.Response === 'True') {
          this.movies.set(res.Search);
          this.totalResults.set(+res.totalResults);
        } else {
          this.movies.set([]);
          this.totalResults.set(0);
          this.error.set(res.Error || 'Aucun résultat trouvé.');
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Erreur réseau. Vérifie ta connexion.');
        this.loading.set(false);
      }
    });
  }

  // ── Détail film ──────────────────────────────────────
  getMovieById(imdbID: string): Observable<MovieDetail> {
    const params = new HttpParams()
      .set('apikey', environment.omdbApiKey)
      .set('i', imdbID)
      .set('plot', 'full');

    return this.http.get<MovieDetail>(environment.omdbBaseUrl, { params });
  }

  // ── Favoris ──────────────────────────────────────────
  toggleFavorite(movie: MovieSummary): void {
    const current = this.favorites();
    const exists = current.find(f => f.imdbID === movie.imdbID);
    const updated = exists
      ? current.filter(f => f.imdbID !== movie.imdbID)
      : [...current, movie];

    this.favorites.set(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  }

  isFavorite(imdbID: string): boolean {
    return this.favorites().some(f => f.imdbID === imdbID);
  }

  private loadFavorites(): MovieSummary[] {
    try {
      return JSON.parse(localStorage.getItem('favorites') || '[]');
    } catch {
      return [];
    }
  }
}
