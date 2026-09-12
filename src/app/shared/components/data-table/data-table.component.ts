import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({ selector: 'app-data-table', standalone: true, imports: [CommonModule], styleUrl: './data-table.scss', template: `<div class="order-table"><div class="table-head"><span *ngFor="let column of columns">{{ column }}</span></div><div class="table-row" *ngFor="let row of rows"><span *ngFor="let column of columns">{{ row[column] ?? '—' }}</span></div></div>` })
export class DataTableComponent { @Input() columns: string[] = []; @Input() rows: Record<string, unknown>[] = []; }
