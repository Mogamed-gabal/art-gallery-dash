import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
export const authGuard: CanActivateFn = () => inject(AuthService).isAuthenticated() || inject(Router).createUrlTree(['/']);
export const adminGuard: CanActivateFn = () => inject(AuthService).isAuthenticated() || inject(Router).createUrlTree(['/']);
