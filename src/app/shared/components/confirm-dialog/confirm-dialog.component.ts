import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({ selector: 'app-confirm-dialog', standalone: true, imports: [CommonModule], styleUrl: './confirm-dialog.scss', template: `<div *ngIf="open" class="dialog-backdrop"><section class="confirm-dialog"><span class="eyebrow">تأكيد العملية</span><h3>{{ title }}</h3><p>{{ message }}</p><div><button class="soft-button" (click)="cancel.emit()">إلغاء</button><button class="primary-button" (click)="confirm.emit()">تأكيد</button></div></section></div>` })
export class ConfirmDialogComponent { @Input() open = false; @Input() title = 'هل أنت متأكدة؟'; @Input() message = ''; @Output() confirm = new EventEmitter<void>(); @Output() cancel = new EventEmitter<void>(); }
