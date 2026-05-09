import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MovieDetail, MovieSummary, SearchFilters, SearchResponse } from '../models/movie.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OmdbService {
  private http = inject(HttpClient);

  // ── Signals ──────────────────────────────────────────
  movies = signal<MovieSummary[]>([]);
  totalResults = signal<number>(0);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  totalPages = computed(() => Math.ceil(this.totalResults() / 10));

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
}
