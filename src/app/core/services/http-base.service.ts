import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiPayload } from '../models/domain.models';

declare global {
  interface Window { __APP_CONFIG__?: { apiBaseUrl?: string }; }
}

@Injectable({ providedIn: 'root' })
export class HttpBaseService {
  protected readonly http = inject(HttpClient);
  protected readonly baseUrl = globalThis.window?.__APP_CONFIG__?.apiBaseUrl ?? 'http://localhost:3005/api/v1';
  protected unwrap<T>(response: T | ApiPayload<T>): T { return response && typeof response === 'object' && 'data' in response ? (response as ApiPayload<T>).data : response as T; }
  protected params(values: Record<string, string | number | boolean | undefined>) { let params = new HttpParams(); Object.entries(values).forEach(([key, value]) => { if (value !== undefined) params = params.set(key, String(value)); }); return params; }
  protected get<T>(path: string, query: Record<string, string | number | boolean | undefined> = {}): Observable<T> { return this.http.get<T | ApiPayload<T>>(`${this.baseUrl}${path}`, { params: this.params(query) }).pipe(map(value => this.unwrap(value))); }
  protected post<T>(path: string, body: unknown): Observable<T> { return this.http.post<T | ApiPayload<T>>(`${this.baseUrl}${path}`, body).pipe(map(value => this.unwrap(value))); }
  protected patch<T>(path: string, body: unknown): Observable<T> { return this.http.patch<T | ApiPayload<T>>(`${this.baseUrl}${path}`, body).pipe(map(value => this.unwrap(value))); }
  protected put<T>(path: string, body: unknown): Observable<T> { return this.http.put<T | ApiPayload<T>>(`${this.baseUrl}${path}`, body).pipe(map(value => this.unwrap(value))); }
  protected delete<T>(path: string): Observable<T> { return this.http.delete<T | ApiPayload<T>>(`${this.baseUrl}${path}`).pipe(map(value => this.unwrap(value))); }
  protected upload<T>(path: string, data: FormData): Observable<T> { return this.http.post<T | ApiPayload<T>>(`${this.baseUrl}${path}`, data).pipe(map(value => this.unwrap(value))); }
}
