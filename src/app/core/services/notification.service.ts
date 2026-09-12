import { Injectable, signal } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly message = signal(''); readonly type = signal<'success' | 'error' | 'info'>('info'); readonly confirmation = signal<{ message: string; title: string } | null>(null); private timer?: number; private confirmAction?: () => void;
  show(message: string, type: 'success' | 'error' | 'info' = 'info') { this.message.set(message); this.type.set(type); window.clearTimeout(this.timer); this.timer = window.setTimeout(() => this.message.set(''), 3500); }
  success(message: string) { this.show(message, 'success'); } error(message: string) { this.show(message, 'error'); } info(message: string) { this.show(message, 'info'); }
  confirm(message: string, action: () => void, title = 'تأكيد الإجراء') { this.confirmAction = action; this.confirmation.set({ message, title }); }
  resolveConfirmation(accepted: boolean) { const action = this.confirmAction; this.confirmAction = undefined; this.confirmation.set(null); if (accepted) action?.(); }
}
