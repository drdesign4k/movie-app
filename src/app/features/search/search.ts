import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { OmdbService } from '../../core/services/omdb';
import { FavoritesService } from '../../core/services/favorites';
import { AuthService } from '../../core/services/auth';
import { MovieCard } from '../../shared/components/movie-card/movie-card';
import { SearchFilters } from '../../core/models/movie.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MovieCard
  ],
  templateUrl: './search.html',
  styleUrl: './search.scss'
})
export class Search implements OnInit {
  omdbService = inject(OmdbService);
  favoritesService = inject(FavoritesService);
  authService = inject(AuthService);

  query = '';
  selectedType = '';
  selectedYear = '';
  currentPage = signal(1);

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.favoritesService.loadFavorites();
    }
  }

  onSearch() {
    if (!this.query.trim()) return;
    this.currentPage.set(1);
    this.search();
  }

  onPageChange(event: PageEvent) {
    this.currentPage.set(event.pageIndex + 1);
    this.search();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private search() {
    const filters: SearchFilters = {
      query: this.query,
      type: this.selectedType as any,
      year: this.selectedYear,
      page: this.currentPage()
    };
    this.omdbService.searchMovies(filters);
  }
  setType(type: string) {
    this.selectedType = type;
    if (this.query.trim()) this.search();
  }
}
