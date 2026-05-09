import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Review, ReviewPayload } from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  private http = inject(HttpClient);

  reviews = signal<Review[]>([]);
  loading = signal(false);

  loadReviews(imdbID: string): void {
    this.loading.set(true);
    this.http.get<Review[]>(`${environment.apiUrl}/reviews/${imdbID}`).subscribe({
      next: (data) => {
        this.reviews.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement avis', err);
        this.loading.set(false);
      }
    });
  }

  addReview(payload: ReviewPayload) {
    return this.http.post<Review>(`${environment.apiUrl}/reviews`, payload);
  }

  deleteReview(id: string) {
    return this.http.delete(`${environment.apiUrl}/reviews/${id}`);
  }
}
