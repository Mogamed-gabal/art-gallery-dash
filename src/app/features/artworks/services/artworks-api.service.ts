import { Injectable } from '@angular/core';
import { HttpBaseService } from '../../../core/services/http-base.service';
import { Artwork, PaginatedResponse } from '../../../core/models/domain.models';
@Injectable({ providedIn: 'root' })
export class ArtworksApiService extends HttpBaseService { list(query: { page?: number; limit?: number; search?: string; categoryId?: string } = {}) { return this.get<PaginatedResponse<Artwork> | Artwork[]>('/artworks', query); } getById(id: string) { return this.get<Artwork>(`/artworks/${id}`); } featured() { return this.get<Artwork[]>('/artworks/home-featured'); } create(data: FormData) { return this.upload<Artwork>('/artworks', data); } update(id: string, data: FormData) { return this.patch<Artwork>(`/artworks/${id}`, data); } remove(id: string) { return this.delete<void>(`/artworks/${id}`); } }
