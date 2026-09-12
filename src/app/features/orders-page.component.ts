import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersApiService, OrderStatus } from './orders/services/orders-api.service';
import { Order } from '../core/models/domain.models';
import { NotificationService } from '../core/services/notification.service';
@Component({ selector: 'app-orders-page', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './orders-page.html', styleUrl: './orders-page.scss' })
export class OrdersPageComponent implements OnInit {
  @Input() visible = true; private readonly api = inject(OrdersApiService); private readonly notify = inject(NotificationService); orders: Order[] = []; orderFilter = 'الكل'; search = ''; loading = false;
  ngOnInit() { this.load(); }
  load() { this.loading = true; const query: { page: number; limit: number; paymentStatus?: string; orderStatus?: string } = { page: 1, limit: 100 }; if (this.orderFilter === 'بانتظار الدفع') query.paymentStatus = 'PENDING'; if (this.orderFilter === 'مكتمل') query.orderStatus = 'DELIVERED'; this.api.list(query).subscribe({ next: value => { this.orders = Array.isArray(value) ? value : value.items; this.loading = false; }, error: () => this.loading = false }); }
  get filteredOrders() { const term = this.search.trim().toLowerCase(); return term ? this.orders.filter(order => `${order.orderNumber} ${order.customerName} ${order.email ?? ''}`.toLowerCase().includes(term)) : this.orders; }
  itemLabel(order: Order) { return order.items?.map(item => item.artwork?.titleAr ?? item.itemType).join('، ') || '—'; }
  setStatus(order: Order, status: string) { this.api.updateStatus(order.id, status as OrderStatus).subscribe({ next: value => { Object.assign(order, value); this.notify.success('تم تحديث حالة الطلب'); }, error: () => undefined }); }
  paymentLabel(status: string) { return status === 'PAID' ? 'مدفوع' : status === 'PENDING' ? 'معلق' : status; }
  statusLabel(status: string) { return ({ PROCESSING: 'قيد التنفيذ', SHIPPED: 'تم الشحن', DELIVERED: 'مكتمل', CANCELLED: 'ملغي' } as Record<string, string>)[status] ?? status; }
  statusTone(status: string) { return status === 'DELIVERED' ? 'success' : status === 'PROCESSING' ? 'warning' : 'neutral'; }
  refresh() { this.load(); }
}
