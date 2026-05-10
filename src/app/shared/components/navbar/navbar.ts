import { Component, inject, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../core/services/auth';
import { FavoritesService } from '../../../core/services/favorites';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatMenuModule,
    MatInputModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  authService = inject(AuthService);
  favoritesService = inject(FavoritesService);
  private router = inject(Router);
  scrolled = false;
  searchQuery = '';

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 50;
  }

  onSearch() {
    if (!this.searchQuery.trim()) return;
    this.router.navigate(['/search'], {
      queryParams: { q: this.searchQuery }
    });
    this.searchQuery = '';
  }
}
