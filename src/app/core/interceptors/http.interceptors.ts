import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => { const token = localStorage.getItem('art-gallery-token'); return next(token ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : request); };
export const apiUrlInterceptor: HttpInterceptorFn = (request, next) => next(request);
export const errorInterceptor: HttpInterceptorFn = (request, next) => { const notifications = inject(NotificationService); const router = inject(Router); return next(request).pipe(catchError((error: HttpErrorResponse) => { if (error.status === 401 && !request.url.includes('/auth/login')) { localStorage.removeItem('art-gallery-token'); router.navigateByUrl('/'); } notifications.error(error.error?.message || 'تعذر تنفيذ الطلب. تأكدي من تشغيل الـ Backend.'); return throwError(() => error); })); };
