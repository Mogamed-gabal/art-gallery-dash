import { Injectable } from '@angular/core';
import { HttpBaseService } from '../../../core/services/http-base.service';
import { Order, PaginatedResponse } from '../../../core/models/domain.models';
export type OrderStatus = 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
@Injectable({ providedIn: 'root' })
export class OrdersApiService extends HttpBaseService { list(query: { page?: number; limit?: number; paymentStatus?: string; orderStatus?: string } = {}) { return this.get<PaginatedResponse<Order> | Order[]>('/orders', query); } getById(id: string) { return this.get<Order>(`/orders/${id}`); } updateStatus(id: string, orderStatus: OrderStatus) { return this.patch<Order>(`/orders/${id}/status`, { orderStatus }); } }
