import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesApiService } from './categories/services/categories-api.service';
import { Category } from '../core/models/domain.models';
import { NotificationService } from '../core/services/notification.service';
import { CategoryModalComponent } from './categories/components/category-modal/category-modal.component';
import { ArtworksApiService } from './artworks/services/artworks-api.service';
@Component({ selector: 'app-categories-page', standalone: true, imports: [CommonModule, CategoryModalComponent], templateUrl: './categories-page.html', styleUrl: './categories-page.scss' })
export class CategoriesPageComponent implements OnInit {
  @Input() visible = true; private readonly api = inject(CategoriesApiService); private readonly artworksApi = inject(ArtworksApiService); private readonly notify = inject(NotificationService); categories: Category[] = []; artworkCounts: Record<string, number> = {}; showForm = false; loading = false;
  ngOnInit() { this.load(); } load() { this.loading = true; this.api.list().subscribe({ next: value => { this.categories = value ?? []; this.categories.forEach(category => this.artworksApi.list({ page: 1, limit: 50, categoryId: category.id }).subscribe(result => this.artworkCounts[category.id] = Array.isArray(result) ? result.length : result.meta.total)); this.loading = false; }, error: () => this.loading = false }); }
  count(category: Category) { return this.artworkCounts[category.id] ?? category.artworksCount ?? category.artworks?.length ?? 0; }
  save(values: { nameAr: string; nameEn: string; slug: string }) { this.api.create(values).subscribe({ next: () => { this.notify.success('تم إنشاء التصنيف بنجاح'); this.showForm = false; this.load(); }, error: () => undefined }); }
  remove(category: Category) { this.notify.confirm(`سيتم حذف «${category.nameAr}». لا يمكن حذف تصنيف يحتوي على أعمال فنية.`, () => this.api.remove(category.id).subscribe({ next: () => { this.notify.success('تم حذف التصنيف بنجاح'); this.load(); }, error: () => undefined })); }
}
