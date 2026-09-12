import { Injectable } from '@angular/core';
import { HttpBaseService } from '../../../core/services/http-base.service';
import { Category } from '../../../core/models/domain.models';
@Injectable({ providedIn: 'root' })
export class CategoriesApiService extends HttpBaseService { list() { return this.get<Category[]>('/categories'); } create(body: { nameAr: string; nameEn: string; slug: string }) { return this.post<Category>('/categories', body); } remove(id: string) { return this.delete<void>(`/categories/${id}`); } }
