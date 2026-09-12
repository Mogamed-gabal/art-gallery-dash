import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Course } from '../../../../core/models/domain.models';
import { NotificationService } from '../../../../core/services/notification.service';

export interface CourseFormPayload {
  title: string;
  description: string;
  externalUrl: string;
  isActive: boolean;
  welcomeVideoUrl?: string;
  videoFile?: File | null;
}

@Component({
  selector: 'app-course-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrl: './course-form-modal.scss',
  templateUrl: './course-form-modal.html'
})
export class CourseFormModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly notify = inject(NotificationService);

  @Output() save = new EventEmitter<CourseFormPayload>();
  @Output() cancel = new EventEmitter<void>();

  selectedVideoFile: File | null = null;
  selectedVideoName = '';
  existingVideoUrl: string | null = null;

  @Input() set course(value: Course | null) {
    this.selectedVideoFile = null;
    this.selectedVideoName = '';
    if (value) {
      this.existingVideoUrl = value.welcomeVideoUrl ?? null;
      this.form.patchValue({
        title: value.title,
        description: value.description,
        externalUrl: value.externalUrl,
        isActive: value.isActive,
        welcomeVideoUrl: value.welcomeVideoUrl ?? ''
      });
    } else {
      this.existingVideoUrl = null;
      this.form.reset({
        title: '',
        description: '',
        externalUrl: '',
        isActive: true,
        welcomeVideoUrl: ''
      });
    }
  }

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(180)]],
    description: ['', Validators.required],
    externalUrl: ['', [Validators.required, Validators.pattern(/^https:\/\/[^\s]+$/i)]],
    isActive: [true],
    welcomeVideoUrl: ['']
  });

  chooseVideo(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!/^video\/(mp4|webm|quicktime|x-matroska)$/.test(file.type) && !/\.(mp4|webm|mov|mkv)$/i.test(file.name)) {
      this.notify.error('يرجى اختيار ملف فيديو صالح (MP4, WebM, MOV)');
      input.value = '';
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      this.notify.error('حجم الفيديو يجب ألا يتجاوز 100 ميجابايت');
      input.value = '';
      return;
    }

    this.selectedVideoFile = file;
    this.selectedVideoName = file.name;
    input.value = '';
  }

  removeVideo() {
    this.selectedVideoFile = null;
    this.selectedVideoName = '';
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notify.error('يرجى إكمال اسم الكورس والوصف والتأكد من إدخال رابط HTTPS صحيح');
      return;
    }

    const val = this.form.getRawValue();
    this.save.emit({
      title: val.title,
      description: val.description,
      externalUrl: val.externalUrl,
      isActive: val.isActive,
      welcomeVideoUrl: val.welcomeVideoUrl || undefined,
      videoFile: this.selectedVideoFile
    });
  }
}
