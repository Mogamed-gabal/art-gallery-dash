import { Injectable } from '@angular/core';
import { HttpBaseService } from '../../../core/services/http-base.service';
import { Course } from '../../../core/models/domain.models';

@Injectable({ providedIn: 'root' })
export class CoursesApiService extends HttpBaseService {
  list() { return this.get<Course[]>('/courses'); }
  listAdmin() { return this.get<Course[]>('/courses/admin/all'); }
  create(data: unknown) { return this.post<Course>('/courses', data); }
  update(id: string, data: unknown) { return this.patch<Course>(`/courses/${id}`, data); }
  remove(id: string) { return this.delete<void>(`/courses/${id}`); }
}
