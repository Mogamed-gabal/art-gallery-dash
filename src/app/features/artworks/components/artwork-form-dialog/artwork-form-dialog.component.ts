import { Component, EventEmitter, Input, Output, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category, Artwork } from '../../../../core/models/domain.models';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-artwork-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './artwork-form-dialog.html',
  styleUrl: './artwork-form-dialog.scss'
})
export class ArtworkFormDialogComponent implements OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly notify = inject(NotificationService);

  @Input() categories: Category[] = [];
  existingImages = false;
  existingArtworkImages: { url: string; isPrimary: boolean }[] = [];

  @Input() set artwork(value: Artwork | null) {
    this.existingImages = !!value?.images?.length;
    this.existingArtworkImages = value?.images ? [...value.images] : [];
    if (value) {
      this.form.patchValue({
        titleAr: value.titleAr,
        titleEn: value.titleEn,
        storyAr: value.storyAr,
        storyEn: value.storyEn,
        price: Number(value.price),
        discountPrice: value.discountPrice ? Number(value.discountPrice) : null,
        onSale: value.onSale,
        quantity: value.quantity,
        isBestSeller: value.isBestSeller,
        categoryId: value.category?.id ?? '',
        primaryImageIndex: 0
      });
    }
  }

  @Output() save = new EventEmitter<{ values: Record<string, unknown>; files: File[] }>();
  @Output() cancel = new EventEmitter<void>();

  files: File[] = [];
  previews: string[] = [];

  readonly form = this.fb.nonNullable.group({
    titleAr: ['', Validators.required],
    titleEn: [''],
    storyAr: ['', [Validators.required, Validators.minLength(5)]],
    storyEn: [''],
    price: [0, [Validators.required, Validators.min(0.01)]],
    discountPrice: [null as number | null],
    onSale: [false],
    quantity: [1, [Validators.required, Validators.min(0)]],
    isBestSeller: [false],
    categoryId: ['', Validators.required],
    primaryImageIndex: [0]
  });

  ngOnDestroy() {
    this.cleanupPreviews();
  }

  private cleanupPreviews() {
    for (const preview of this.previews) {
      URL.revokeObjectURL(preview);
    }
  }

  choose(event: Event) {
    const input = event.target as HTMLInputElement;
    const selected = Array.from(input.files ?? []);
    if (!selected.length) return;

    if (this.files.length + selected.length > 5) {
      this.notify.error(`يمكنك إضافة حتى 5 صور كحد أقصى (لديك حالياً ${this.files.length} صور)`);
      input.value = '';
      return;
    }

    const invalid = selected.find(file => !/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 5 * 1024 * 1024);
    if (invalid) {
      this.notify.error('كل صورة يجب أن تكون JPG أو PNG أو WebP وبحجم أقصى 5MB');
      input.value = '';
      return;
    }

    for (const file of selected) {
      this.files.push(file);
      this.previews.push(URL.createObjectURL(file));
    }
    input.value = '';
  }

  setPrimary(index: number) {
    this.form.patchValue({ primaryImageIndex: index });
  }

  removeFile(index: number) {
    if (this.previews[index]) {
      URL.revokeObjectURL(this.previews[index]);
    }
    this.files.splice(index, 1);
    this.previews.splice(index, 1);

    const currentPrimary = this.form.controls.primaryImageIndex.value;
    if (currentPrimary === index) {
      this.form.patchValue({ primaryImageIndex: 0 });
    } else if (currentPrimary > index) {
      this.form.patchValue({ primaryImageIndex: currentPrimary - 1 });
    }
  }

  submit() {
    const value = this.form.getRawValue();
    if (this.form.invalid || (!this.files.length && !this.existingImages)) {
      this.form.markAllAsTouched();
      this.notify.error('يرجى التأكد من ملء جميع الحقول المطلوبة وإضافة صورة واحدة على الأقل');
      return;
    }
    if (value.discountPrice !== null && value.discountPrice !== undefined && (value.discountPrice < 0 || value.discountPrice > value.price)) {
      this.notify.error('سعر الخصم يجب أن يكون أقل من السعر الأساسي');
      return;
    }
    this.save.emit({ values: value, files: this.files });
  }
}
