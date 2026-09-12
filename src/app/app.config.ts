import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor, apiUrlInterceptor, errorInterceptor } from './core/interceptors/http.interceptors';
export const appConfig: ApplicationConfig = { providers: [provideRouter(routes), provideHttpClient(withInterceptors([apiUrlInterceptor, authInterceptor, errorInterceptor]))] };
