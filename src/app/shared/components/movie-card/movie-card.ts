import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MovieSummary } from '../../../core/models/movie.model';
import { FavoritesService } from '../../../core/services/favorites';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.scss'
})
export class MovieCard {
  movie = input.required<MovieSummary>();
  private router = inject(Router);
  favoritesService = inject(FavoritesService);
  authService = inject(AuthService);

  goToDetail() {
    this.router.navigate(['/movie', this.movie().imdbID]);
  }

  toggleFav() {
    this.favoritesService.toggleFavorite(this.movie());
  }

  isFavorite(): boolean {
    return this.favoritesService.isFavorite(this.movie().imdbID);
  }
}
