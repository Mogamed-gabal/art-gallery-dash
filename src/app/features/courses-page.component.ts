import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesApiService } from './courses/services/courses-api.service';
import { Course } from '../core/models/domain.models';
import { NotificationService } from '../core/services/notification.service';
import { CourseFormModalComponent, CourseFormPayload } from './courses/components/course-form-modal/course-form-modal.component';

@Component({ selector: 'app-courses-page', standalone: true, imports: [CommonModule, CourseFormModalComponent], templateUrl: './courses-page.html', styleUrl: './courses-page.scss' })
export class CoursesPageComponent implements OnInit {
  @Input() visible = true;
  private readonly api = inject(CoursesApiService);
  private readonly notify = inject(NotificationService);
  courses: Course[] = [];
  showForm = false;
  editing: Course | null = null;
  loading = false;

  ngOnInit() { this.load(); }
  load() { this.loading = true; this.api.listAdmin().subscribe({ next: value => { this.courses = value ?? []; this.loading = false; }, error: error => { this.loading = false; this.notify.error(this.apiError(error, 'تعذر تحميل الكورسات')); } }); }
  openCreate() { this.editing = null; this.showForm = true; }
  openEdit(course: Course) { this.editing = course; this.showForm = true; }
  close() { this.showForm = false; this.editing = null; }

  save(values: CourseFormPayload) {
    this.loading = true;
    let payload: FormData | Record<string, unknown>;

    if (values.videoFile) {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('externalUrl', values.externalUrl);
      formData.append('isActive', String(values.isActive));
      if (values.welcomeVideoUrl) {
        formData.append('welcomeVideoUrl', values.welcomeVideoUrl);
      }
      formData.append('video', values.videoFile);
      payload = formData;
    } else {
      payload = {
        title: values.title,
        description: values.description,
        externalUrl: values.externalUrl,
        isActive: values.isActive,
        ...(values.welcomeVideoUrl ? { welcomeVideoUrl: values.welcomeVideoUrl } : {})
      };
    }

    const request = this.editing ? this.api.update(this.editing.id, payload) : this.api.create(payload);
    request.subscribe({
      next: () => {
        this.notify.success(this.editing ? 'تم تعديل بيانات الكورس بنجاح' : 'تم إنشاء الكورس بنجاح');
        this.close();
        this.load();
      },
      error: error => {
        this.loading = false;
        this.notify.error(this.apiError(error, 'تعذر حفظ بيانات الكورس'));
      }
    });
  }

  remove(course: Course) { this.notify.confirm(`سيتم حذف «${course.title}» نهائياً.`, () => this.api.remove(course.id).subscribe({ next: () => { this.notify.success('تم حذف الكورس بنجاح'); this.load(); }, error: error => this.notify.error(this.apiError(error, 'تعذر حذف الكورس')) })); }
  private apiError(error: any, fallback: string): string { const message = error?.error?.message; return Array.isArray(message) ? message.join('، ') : message || fallback; }
}

