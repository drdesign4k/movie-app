import { Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OmdbService } from '../../core/services/omdb';
import { FavoritesService } from '../../core/services/favorites';
import { ReviewsService } from '../../core/services/reviews';
import { HistoryService } from '../../core/services/history';
import { AuthService } from '../../core/services/auth';
import { MovieDetail } from '../../core/models/movie.model';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    DatePipe
  ],
  templateUrl: './detail.html',
  styleUrl: './detail.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(30px)'
        }),
        animate(
          '700ms cubic-bezier(0.22,1,0.36,1)',
          style({
            opacity: 1,
            transform: 'translateY(0)'
          })
        )
      ])
    ])
  ]
})
export class Detail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private omdbService = inject(OmdbService);
  favoritesService = inject(FavoritesService);
  reviewsService = inject(ReviewsService);
  private historyService = inject(HistoryService);
  authService = inject(AuthService);
  private fb = inject(FormBuilder);

  movie = signal<MovieDetail | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  submittingReview = signal(false);

  reviewForm: FormGroup = this.fb.group({
    rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', Validators.maxLength(500)]
  });

  ngOnInit() {
    const imdbID = this.route.snapshot.paramMap.get('id')!;
    this.loadMovie(imdbID);
  }

  // Charger les détails du film
  loadMovie(imdbID: string) {
    this.loading.set(true);
    this.error.set(null);

    this.omdbService.getMovieById(imdbID).subscribe({
      next: (data) => {
        this.movie.set(data);
        this.loading.set(false);
        this.historyService.addToHistory({
          imdbID: data.imdbID,
          title: data.Title,
          poster: data.Poster
        });
        this.reviewsService.loadReviews(imdbID);
      },
      error: () => {
        this.error.set('Film introuvable.');
        this.loading.set(false);
      }
    });
  }

  // Recharger la page en cas d'erreur
  reload() {
    const imdbID = this.route.snapshot.paramMap.get('id')!;
    this.loadMovie(imdbID);
  }

  // Jouer la bande-annonce (à implémenter selon votre API)
  playTrailer() {
    const movieTitle = this.movie()?.Title;
    if (movieTitle) {
      // Option 1: Ouvrir une recherche YouTube
      const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(movieTitle + ' trailer')}`;
      window.open(youtubeSearchUrl, '_blank');

      // Option 2: Si vous avez une API YouTube, vous pouvez intégrer un modal
      // this.openTrailerModal();
    }
  }

  // Naviguer vers la page de login
  goToLogin() {
    this.router.navigate(['/login']);
  }

  // Retourner à la page précédente
  goBack() {
    this.router.navigate(['/movies']);
  }

  // Calculer la note moyenne des avis
  getAverageRating(): string {
    const reviews = this.reviewsService.reviews();
    if (reviews.length === 0) return 'N/A';
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    return avg.toFixed(1);
  }

  // Obtenir le nombre total d'avis
  getTotalReviews(): number {
    return this.reviewsService.reviews().length;
  }

  // Obtenir le pourcentage d'avis par note (pour les stats)
  getRatingPercentage(rating: number): number {
    const reviews = this.reviewsService.reviews();
    if (reviews.length === 0) return 0;
    const count = reviews.filter(r => r.rating === rating).length;
    return (count / reviews.length) * 100;
  }

  // Compter les avis par note
  getRatingCount(rating: number): number {
    return this.reviewsService.reviews().filter(r => r.rating === rating).length;
  }

  toggleFavorite() {
    const m = this.movie();
    if (!m) return;
    this.favoritesService.toggleFavorite({
      imdbID: m.imdbID,
      Title: m.Title,
      Year: m.Year,
      Type: m.Type,
      Poster: m.Poster
    });
  }

  // Vérifier si le film est dans les favoris
  isFavorite(): boolean {
    const m = this.movie();
    if (!m) return false;
    return this.favoritesService.isFavorite(m.imdbID);
  }

  submitReview() {
    if (this.reviewForm.invalid || !this.movie()) return;
    this.submittingReview.set(true);

    this.reviewsService.addReview({
      imdbID: this.movie()!.imdbID,
      movieTitle: this.movie()!.Title,
      rating: this.reviewForm.value.rating,
      comment: this.reviewForm.value.comment
    }).subscribe({
      next: (review) => {
        this.reviewsService.reviews.update(r => [review, ...r]);
        this.reviewForm.reset();
        this.submittingReview.set(false);
      },
      error: (err) => {
        console.error('Erreur ajout avis', err);
        this.submittingReview.set(false);
      }
    });
  }

  deleteReview(id: string) {
    this.reviewsService.deleteReview(id).subscribe({
      next: () => this.reviewsService.reviews.update(r => r.filter(rv => rv._id !== id)),
      error: (err) => console.error('Erreur suppression avis', err)
    });
  }

  stars(rating: number): string {
    return '⭐'.repeat(rating);
  }

  // Méthode utilitaire pour formater la durée
  getFormattedRuntime(): string {
    const runtime = this.movie()?.Runtime;
    if (!runtime || runtime === 'N/A') return 'Durée inconnue';
    return runtime;
  }

  // Méthode utilitaire pour obtenir l'année
  getFormattedYear(): string {
    const year = this.movie()?.Year;
    if (!year || year === 'N/A') return 'Année inconnue';
    return year;
  }

  // Partager le film
  shareMovie() {
    const m = this.movie();
    if (!m) return;

    const shareData = {
      title: m.Title,
      text: `Découvrez ${m.Title} (${m.Year})`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {
        navigator.clipboard.writeText(window.location.href);
        alert('Lien copié dans le presse-papier !');
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papier !');
    }
  }
}
