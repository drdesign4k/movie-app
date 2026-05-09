import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Favorite } from '../models/favorite.model';
import { MovieSummary } from '../models/movie.model';
import { AuthService } from './auth';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  favorites = signal<Favorite[]>([]);
  totalFavorites = computed(() => this.favorites().length);

  loadFavorites(): void {
    if (!this.authService.isLoggedIn()) return;
    this.http.get<Favorite[]>(`${environment.apiUrl}/favorites`).subscribe({
      next: (data) => this.favorites.set(data),
      error: (err) => console.error('Erreur chargement favoris', err)
    });
  }

  toggleFavorite(movie: MovieSummary): void {
    const exists = this.isFavorite(movie.imdbID);
    if (exists) {
      this.removeFavorite(movie.imdbID);
    } else {
      this.addFavorite(movie);
    }
  }

  addFavorite(movie: MovieSummary): void {
    const payload: Favorite = {
      imdbID: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster,
      type: movie.Type
    };
    this.http.post<Favorite>(`${environment.apiUrl}/favorites`, payload).subscribe({
      next: (fav) => this.favorites.update(favs => [...favs, fav]),
      error: (err) => console.error('Erreur ajout favori', err)
    });
  }

  removeFavorite(imdbID: string): void {
    this.http.delete(`${environment.apiUrl}/favorites/${imdbID}`).subscribe({
      next: () => this.favorites.update(favs => favs.filter(f => f.imdbID !== imdbID)),
      error: (err) => console.error('Erreur suppression favori', err)
    });
  }

  isFavorite(imdbID: string): boolean {
    return this.favorites().some(f => f.imdbID === imdbID);
  }
}
