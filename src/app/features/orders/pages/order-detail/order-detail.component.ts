import { Component, Input } from '@angular/core';
@Component({ selector: 'app-order-detail', standalone: true, template: `<section><span class="eyebrow">تفاصيل الطلب</span><h2>{{ orderId }}</h2><ng-content></ng-content></section>` })
export class OrderDetailComponent { @Input() orderId = ''; }
