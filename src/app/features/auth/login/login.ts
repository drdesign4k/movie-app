import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
    }
    mat-card {
      width: 100%;
      max-width: 400px;
      padding: 2rem;
    }
    .auth-title {
      text-align: center;
      margin-bottom: 1.5rem;
      font-size: 1.8rem;
      font-weight: 600;
    }
    mat-form-field {
      width: 100%;
      margin-bottom: 1rem;
    }
    .auth-btn {
      width: 100%;
      margin-top: 1rem;
      height: 48px;
      font-size: 1rem;
    }
    .auth-link {
      text-align: center;
      margin-top: 1rem;
      font-size: 0.9rem;
    }
    .error-msg {
      color: red;
      text-align: center;
      margin-top: 0.5rem;
      font-size: 0.85rem;
    }
  `],
  template: `
    <div class="auth-container">
      <mat-card>
        <h2 class="auth-title">🎬 Movie App</h2>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email" placeholder="ton@email.com"/>
            <mat-icon matSuffix>email</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Mot de passe</mat-label>
            <input matInput formControlName="password" [type]="showPassword() ? 'text' : 'password'"/>
            <button mat-icon-button matSuffix type="button" (click)="showPassword.set(!showPassword())">
              <mat-icon>{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </mat-form-field>

          @if (error()) {
            <p class="error-msg">{{ error() }}</p>
          }

          <button mat-raised-button color="primary" class="auth-btn" type="submit" [disabled]="loading()">
            @if (loading()) {
              <mat-spinner diameter="24"/>
            } @else {
              Se connecter
            }
          </button>
        </form>

        <p class="auth-link">
          Pas encore de compte ? <a routerLink="/register">S'inscrire</a>
        </p>
      </mat-card>
    </div>
  `
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = signal(false);
  error = signal<string | null>(null);
  showPassword = signal(false);

  onSubmit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);

    this.authService.login(this.form.value).subscribe({
      next: () => this.loading.set(false),
      error: (err) => {
        this.error.set(err.error?.message || 'Erreur de connexion');
        this.loading.set(false);
      }
    });
  }
}
