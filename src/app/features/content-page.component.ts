import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentApiService } from './content/services/content-api.service';
import { NotificationService } from '../core/services/notification.service';
import { SiteContent } from '../core/models/domain.models';
@Component({ selector: 'app-content-page', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './content-page.html', styleUrl: './content-page.scss' })
export class ContentPageComponent implements OnInit {
  @Input() visible = true; private readonly api = inject(ContentApiService); private readonly notify = inject(NotificationService);
  content: SiteContent = { hero: null, about: null, contact: null }; activeKey: 'hero' | 'about' | 'contact' | null = null; saving = false; uploading = false;
  readonly definitions = [{ key: 'hero' as const, title: 'الواجهة الرئيسية', desc: 'العنوان الكبير والوصف والصورة الرئيسية', tone: 'olive' }, { key: 'about' as const, title: 'عن المرسم', desc: 'القصة التي تقف خلف كل لون', tone: 'gold' }, { key: 'contact' as const, title: 'تواصل معنا', desc: 'بيانات الوصول والرسائل', tone: 'terracotta' }];
  ngOnInit() { this.load(); }
  load() { this.api.getSiteInfo().subscribe({ next: value => this.content = value, error: () => undefined }); }
  openEditor(key: 'hero' | 'about' | 'contact') { this.activeKey = key; if (!this.content[key]) this.content[key] = this.defaults[key] as never; }
  readonly defaults: SiteContent = { hero: { titleAr: '', titleEn: '', subtitleAr: '', subtitleEn: '', imageUrl: '' }, about: { titleAr: '', titleEn: '', bioAr: '', bioEn: '', image1Url: '', image2Url: '' }, contact: { titleAr: '', titleEn: '', descriptionAr: '', descriptionEn: '', phone: '', whatsapp: '', email: '' } };
  current(): any { return this.activeKey ? this.content[this.activeKey] : null; }
  save() { if (!this.activeKey || !this.current()) return; this.saving = true; this.api.updateSection(this.activeKey, this.current()).subscribe({ next: value => { const savedData = (value && typeof value === 'object' && 'data' in value) ? (value as any).data : value; this.content[this.activeKey!] = savedData as never; this.saving = false; this.activeKey = null; this.notify.success('تم حفظ التغييرات بنجاح'); }, error: (error) => { this.saving = false; this.notify.error(error?.error?.message || 'تعذر حفظ التغييرات'); } }); }
  uploadImage(event: Event, field: string) { const file = (event.target as HTMLInputElement).files?.[0]; if (!file || !this.activeKey || !this.current()) return; this.uploading = true; this.api.uploadImage(file).subscribe({ next: result => { (this.current() as Record<string, unknown>)[field] = result.secureUrl; this.uploading = false; this.notify.success('تم رفع الصورة بنجاح'); }, error: (error) => { this.uploading = false; this.notify.error(error?.error?.message || 'تعذر رفع الصورة، يرجى التحقق من الملف وإعادة المحاولة'); } }); }
}
