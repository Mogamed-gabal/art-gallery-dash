import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { HttpBaseService } from './http-base.service';

@Injectable({ providedIn: 'root' })
export class AuthService extends HttpBaseService {
  private readonly router = inject(Router);
  readonly token = signal<string | null>(localStorage.getItem('art-gallery-token'));
  readonly isAuthenticated = signal(Boolean(this.token()));
  login(email: string, password: string) { return this.post<{ access_token: string }>('/auth/login', { email, password }).pipe(map(result => { this.token.set(result.access_token); this.isAuthenticated.set(true); localStorage.setItem('art-gallery-token', result.access_token); return true; }), catchError(() => of(false))); }
  logout() { this.token.set(null); this.isAuthenticated.set(false); localStorage.removeItem('art-gallery-token'); this.router.navigateByUrl('/'); }
}
