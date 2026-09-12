import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArtworksApiService } from './artworks/services/artworks-api.service';
import { CategoriesApiService } from './categories/services/categories-api.service';
import { Category, Artwork, PaginatedResponse } from '../core/models/domain.models';
import { NotificationService } from '../core/services/notification.service';
import { ArtworkFormDialogComponent } from './artworks/components/artwork-form-dialog/artwork-form-dialog.component';
@Component({ selector: 'app-artworks-page', standalone: true, imports: [CommonModule, FormsModule, ArtworkFormDialogComponent], templateUrl: './artworks-page.html', styleUrl: './artworks-page.scss' })
export class ArtworksPageComponent implements OnInit {
  @Input() visible = true; private readonly api = inject(ArtworksApiService); private readonly categoriesApi = inject(CategoriesApiService); private readonly notify = inject(NotificationService);
  artworks: Artwork[] = []; categories: Category[] = []; selectedCategory = ''; search = ''; page = 1; total = 0; showForm = false; editing: Artwork | null = null; loading = false;
  ngOnInit() { this.loadCategories(); this.load(); }
  loadCategories() { this.categoriesApi.list().subscribe(value => this.categories = value ?? []); }
  load() { this.loading = true; this.api.list({ page: this.page, limit: 20, search: this.search || undefined, categoryId: this.selectedCategory || undefined }).subscribe({ next: (value: PaginatedResponse<Artwork> | Artwork[]) => { this.artworks = Array.isArray(value) ? value : value.items; this.total = Array.isArray(value) ? value.length : value.meta.total; this.loading = false; }, error: () => this.loading = false }); }
  openCreate() { this.editing = null; this.showForm = true; }
  openEdit(item: Artwork) { this.editing = item; this.showForm = true; }
  closeForm() { this.showForm = false; this.editing = null; }
  image(item: Artwork) { return item.images?.find(image => image.isPrimary)?.url ?? item.images?.[0]?.url ?? ''; }
  categoryName(item: Artwork) { return item.category?.nameAr ?? 'بدون تصنيف'; }
  save(payload: { values: Record<string, unknown>; files: File[] }) { const form = new FormData(); Object.entries(payload.values).forEach(([key, value]) => { if (value !== null && value !== undefined) form.append(key, String(value)); }); payload.files.forEach(file => form.append('images', file)); this.loading = true; const request = this.editing ? this.api.update(this.editing.id, form) : this.api.create(form); request.subscribe({ next: () => { this.notify.success(this.editing ? 'تم تعديل العمل الفني' : 'تم إنشاء العمل الفني'); this.closeForm(); this.load(); }, error: () => this.loading = false }); }
  remove(item: Artwork) { this.notify.confirm(`سيتم حذف «${item.titleAr}» نهائياً من المعرض.`, () => this.api.remove(item.id).subscribe({ next: () => { this.notify.success('تم حذف العمل الفني'); this.load(); }, error: () => undefined })); }
}
