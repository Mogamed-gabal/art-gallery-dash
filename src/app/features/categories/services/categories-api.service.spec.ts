import { CategoriesApiService } from './categories-api.service';
describe('CategoriesApiService', () => { it('exposes category CRUD contract', () => { expect(CategoriesApiService.prototype.list).toBeDefined(); expect(CategoriesApiService.prototype.create).toBeDefined(); expect(CategoriesApiService.prototype.remove).toBeDefined(); }); });
