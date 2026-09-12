import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientRequestsApiService } from '../core/services/client-requests-api.service';
import { ClientRequest } from '../core/models/domain.models';
import { NotificationService } from '../core/services/notification.service';

@Component({
  selector: 'app-client-requests-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-requests-page.html',
  styleUrl: './client-requests-page.scss'
})
export class ClientRequestsPageComponent implements OnInit {
  @Input() visible = true;
  private readonly api = inject(ClientRequestsApiService);
  private readonly notify = inject(NotificationService);

  requests: ClientRequest[] = [];
  search = '';
  loading = false;
  selectedImageModal: string | null = null;

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.api.list().subscribe({
      next: (val) => {
        this.requests = Array.isArray(val) ? val : [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notify.error('فشل تحميل طلبات العملاء');
      }
    });
  }

  get filteredRequests(): ClientRequest[] {
    const term = this.search.trim().toLowerCase();
    if (!term) return this.requests;
    return this.requests.filter((r) =>
      `${r.name || ''} ${r.phone} ${r.whatsapp || ''} ${r.email || ''} ${r.description}`
        .toLowerCase()
        .includes(term)
    );
  }

  getWhatsAppLink(req: ClientRequest): string {
    const raw = req.whatsapp || req.phone;
    const clean = raw.replace(/[^\d+]/g, '');
    const text = encodeURIComponent(`مرحباً ${req.name || ''}، بخصوص طلبك للوحة الفنية المخصصة في مرسم الفنان أنس يعقوب...`);
    return `https://wa.me/${clean}?text=${text}`;
  }

  openImage(url: string) {
    this.selectedImageModal = url;
  }

  closeModal() {
    this.selectedImageModal = null;
  }

  refresh() {
    this.load();
    this.notify.success('تم تحديث طلبات العملاء');
  }
}
