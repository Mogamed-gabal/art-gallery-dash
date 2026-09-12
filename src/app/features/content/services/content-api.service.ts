import { Injectable } from '@angular/core';
import { HttpBaseService } from '../../../core/services/http-base.service';
import { SiteContent } from '../../../core/models/domain.models';
@Injectable({ providedIn: 'root' })
export class ContentApiService extends HttpBaseService { getSiteInfo() { return this.get<SiteContent>('/content/site-info'); } updateSection(sectionKey: string, body: unknown) { return this.put<unknown>(`/content/${sectionKey}`, body); } uploadImage(file: File) { const form = new FormData(); form.append('file', file); return this.upload<{ secureUrl: string; publicId: string }>('/content/upload-image', form); } }
