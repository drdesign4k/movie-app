import { Component, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  Validators,
  NonNullableFormBuilder
} from '@angular/forms';

import { RouterLink } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';

import { finalize } from 'rxjs';

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
    MatProgressSpinnerModule,
    MatFormFieldModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);

  loading = signal(false);
  error = signal<string | null>(null);
  showPassword = signal(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  get email() {
    return this.form.controls.email;
  }

  get password() {
    return this.form.controls.password;
  }

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }

  onSubmit(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.authService
      .login(this.form.getRawValue())
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: () => {
          console.log('Connexion réussie');
        },

        error: (err) => {
          this.error.set(
            err?.error?.message ||
            'Email ou mot de passe incorrect'
          );
        }
      });
  }
}
