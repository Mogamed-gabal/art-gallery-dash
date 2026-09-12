import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { NotificationService } from './core/services/notification.service';
import { LoginPageComponent } from './features/auth/pages/login/login-page.component';
import { DashboardPageComponent } from './features/dashboard-page';
@Component({ selector: 'app-root', standalone: true, imports: [CommonModule, LoginPageComponent, DashboardPageComponent], templateUrl: './app.html', styleUrl: './app.scss' })
export class App { readonly auth = inject(AuthService); readonly notifications = inject(NotificationService); }
