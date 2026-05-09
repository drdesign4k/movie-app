import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User, LoginPayload, RegisterPayload } from '../models/user.model';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // ── Signals ──────────────────────────────────────────
  currentUser = signal<User | null>(this.loadUser());
  isLoggedIn = computed(() => !!this.currentUser());
  username = computed(() => this.currentUser()?.username ?? '');

  // ── Register ─────────────────────────────────────────
  register(payload: RegisterPayload) {
    return this.http.post<User>(`${environment.apiUrl}/auth/register`, payload).pipe(
      tap(user => this.saveUser(user))
    );
  }

  // ── Login ─────────────────────────────────────────────
  login(payload: LoginPayload) {
    return this.http.post<User>(`${environment.apiUrl}/auth/login`, payload).pipe(
      tap(user => this.saveUser(user))
    );
  }

  // ── Logout ────────────────────────────────────────────
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  // ── Helpers ───────────────────────────────────────────
  private saveUser(user: User) {
    localStorage.setItem('token', user.token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
    this.router.navigate(['/']);
  }

  private loadUser(): User | null {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  }
}
