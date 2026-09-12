import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderStatus } from '../../services/orders-api.service';
@Component({ selector: 'app-order-status-modal', standalone: true, imports: [FormsModule], styleUrl: './order-status-modal.scss', template: `<select [(ngModel)]="status" (change)="statusChange.emit(status)"><option value="PROCESSING">قيد التنفيذ</option><option value="SHIPPED">تم الشحن</option><option value="DELIVERED">مكتمل</option><option value="CANCELLED">ملغي</option></select>` })
export class OrderStatusModalComponent { status: OrderStatus = 'PROCESSING'; @Output() statusChange = new EventEmitter<OrderStatus>(); }
