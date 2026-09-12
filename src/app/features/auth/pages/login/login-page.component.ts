import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthFeatureService } from '../../services/auth-feature.service';
import { NotificationService } from '../../../../core/services/notification.service';
@Component({ selector: 'app-login-page', standalone: true, imports: [CommonModule, ReactiveFormsModule], templateUrl: './login-page.html', styleUrl: './login-page.scss' })
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder); private readonly auth = inject(AuthFeatureService); private readonly notifications = inject(NotificationService);
  loading = false;
  readonly form = this.fb.nonNullable.group({ email: ['', [Validators.required, Validators.email]], password: ['', [Validators.required, Validators.minLength(8)]] });
  submit() { if (this.form.invalid) { this.form.markAllAsTouched(); return; } this.loading = true; this.auth.login(this.form.controls.email.value, this.form.controls.password.value).subscribe(ok => { this.loading = false; if (!ok) this.notifications.error('بيانات الدخول غير صحيحة أو تعذر الاتصال بالخادم'); else this.notifications.success('تم تسجيل الدخول بنجاح'); }); }
}
