import { Injectable, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
@Injectable({ providedIn: 'root' })
export class AuthFeatureService { private readonly auth = inject(AuthService); login(email: string, password: string) { return this.auth.login(email, password); } logout() { this.auth.logout(); } }
