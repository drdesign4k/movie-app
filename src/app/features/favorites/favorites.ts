import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FavoritesService } from '../../core/services/favorites';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatCardModule, MatProgressSpinnerModule, RouterLink],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss'
})
export class Favorites implements OnInit {
  favoritesService = inject(FavoritesService);
  authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.favoritesService.loadFavorites();
  }

  goToDetail(imdbID: string) {
    this.router.navigate(['/movie', imdbID]);
  }

  removeFavorite(imdbID: string, event: Event) {
    event.stopPropagation();
    this.favoritesService.removeFavorite(imdbID);
  }
}
