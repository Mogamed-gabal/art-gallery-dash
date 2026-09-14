import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { NotificationService } from '../core/services/notification.service';
import { ArtworksApiService } from './artworks/services/artworks-api.service';
import { CoursesApiService } from './courses/services/courses-api.service';
import { OrdersApiService } from './orders/services/orders-api.service';
import { ClientRequestsApiService } from '../core/services/client-requests-api.service';
import { Artwork, Course, Order, ClientRequest } from '../core/models/domain.models';
import { dashboardNav, DashboardStat, ViewKey } from '../core/models/dashboard.models';
import { ArtworksPageComponent } from './artworks-page.component';
import { CategoriesPageComponent } from './categories-page.component';
import { OrdersPageComponent } from './orders-page.component';
import { CoursesPageComponent } from './courses-page.component';
import { ContentPageComponent } from './content-page.component';
import { ClientRequestsPageComponent } from './client-requests-page.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ArtworksPageComponent,
    CategoriesPageComponent,
    OrdersPageComponent,
    CoursesPageComponent,
    ContentPageComponent,
    ClientRequestsPageComponent
  ],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss'
})
export class DashboardPageComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly notifications = inject(NotificationService);
  private readonly artworksApi = inject(ArtworksApiService);
  private readonly coursesApi = inject(CoursesApiService);
  private readonly ordersApi = inject(OrdersApiService);
  private readonly clientRequestsApi = inject(ClientRequestsApiService);

  active: ViewKey = 'overview';
  artworkFilter = 'الكل';
  orderFilter = 'الكل';
  toastMessage = '';
  sidebarOpen = false;
  navItems = dashboardNav;
  artworks: Artwork[] = [];
  courses: Course[] = [];
  orders: Order[] = [];
  clientRequests: ClientRequest[] = [];

  get stats(): DashboardStat[] {
    return [
      { label: 'إجمالي المبيعات', value: `${this.orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0).toLocaleString('ar-EG')} ج.م`, delta: `${this.orders.length} طلب`, icon: '↗', tone: 'gold' },
      { label: 'طلبات خاصة واردة', value: String(this.clientRequests.length), delta: 'من العملاء', icon: '✦', tone: 'terracotta' },
      { label: 'طلبات قيد التنفيذ', value: String(this.orders.filter(order => order.orderStatus === 'PROCESSING').length), delta: 'من المبيعات المباشرة', icon: '◈', tone: 'sage' },
      { label: 'الأعمال المعروضة', value: String(this.artworks.length), delta: 'من المعرض', icon: '▣', tone: 'ink' }
    ];
  }

  readonly pageMeta: Record<ViewKey, [string, string]> = {
    overview: ['نظرة عامة', 'كل ما يهمك، في لمحة واحدة'],
    requests: ['طلبات اللوحات الخاصة', 'استعراض أفكار العملاء والصور المرفقة للتنفيذ المباشر'],
    orders: ['الطلبات', 'من المرسم إلى باب العميلة'],
    artworks: ['الأعمال الفنية', 'المجموعة التي تحمل بصمتك'],
    categories: ['التصنيفات', 'رتّبي الحكايات كما تحبين'],
    courses: ['الكورسات', 'المعرفة التي تترك أثراً'],
    content: ['محتوى المعرض', 'صوت العلامة يبدأ من هنا']
  };

  ngOnInit() {
    this.loadRemote();
  }

  get pageTitle() { return this.pageMeta[this.active][0]; }
  get pageSubtitle() { return this.pageMeta[this.active][1]; }

  get filteredArtworks() {
    return this.artworkFilter === 'الكل' ? this.artworks : this.artworks.filter(item => item.category?.nameAr === this.artworkFilter);
  }

  get filteredOrders() {
    if (this.orderFilter === 'الكل') return this.orders;
    if (this.orderFilter === 'بانتظار الدفع') return this.orders.filter(item => item.paymentStatus === 'PENDING');
    return this.orders.filter(item => item.orderStatus === 'DELIVERED');
  }

  private normalize<T>(value: T[] | { items?: T[] }): T[] {
    return Array.isArray(value) ? value : value.items ?? [];
  }

  loadRemote() {
    this.artworksApi.list({ page: 1, limit: 50 }).subscribe(value => this.artworks = this.normalize<Artwork>(value));
    this.coursesApi.listAdmin().subscribe(value => this.courses = value ?? []);
    this.ordersApi.list({ page: 1, limit: 50 }).subscribe(value => this.orders = this.normalize<Order>(value));
    this.clientRequestsApi.list().subscribe(value => this.clientRequests = Array.isArray(value) ? value : []);
  }

  selectView(view: ViewKey) { this.active = view; }
  toggleSidebar() { this.sidebarOpen = !this.sidebarOpen; }
  closeSidebar() { this.sidebarOpen = false; }
  selectViewAndClose(view: ViewKey) { this.selectView(view); this.closeSidebar(); }
  refresh() { this.loadRemote(); this.notifications.success('تم تحديث البيانات'); }
  action(message: string) { this.notifications.info(message); }
  isActive(key: ViewKey) { return this.active === key; }

  globalSearch(event: Event) {
    const term = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (!term) return;
    if (this.clientRequests.some(r => `${r.name || ''} ${r.phone} ${r.description}`.toLowerCase().includes(term))) this.active = 'requests';
    else if (this.orders.some(order => `${order.orderNumber} ${order.customerName}`.toLowerCase().includes(term))) this.active = 'orders';
    else if (this.artworks.some(artwork => `${artwork.titleAr} ${artwork.titleEn}`.toLowerCase().includes(term))) this.active = 'artworks';
    else if (this.courses.some(course => `${course.title} ${course.description}`.toLowerCase().includes(term))) this.active = 'courses';
  }

  logout() { this.auth.logout(); }
  statusLabel(status: string) { return ({ DELIVERED: 'مكتمل', PENDING: 'بانتظار الدفع', SHIPPED: 'تم الشحن', PROCESSING: 'قيد التنفيذ', CANCELLED: 'ملغي' } as Record<string, string>)[status] ?? status; }
  statusTone(status: string) { return status === 'DELIVERED' ? 'success' : status === 'PROCESSING' ? 'warning' : 'neutral'; }
}

