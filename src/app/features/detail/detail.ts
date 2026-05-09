import { Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
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
import { trigger, transition, style, animate} from '@angular/animations';

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
}
