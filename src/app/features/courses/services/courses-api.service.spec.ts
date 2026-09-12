import { CoursesApiService } from './courses-api.service';
describe('CoursesApiService', () => { it('exposes course multipart CRUD contract', () => { expect(CoursesApiService.prototype.listAdmin).toBeDefined(); expect(CoursesApiService.prototype.create).toBeDefined(); expect(CoursesApiService.prototype.update).toBeDefined(); expect(CoursesApiService.prototype.remove).toBeDefined(); }); });
