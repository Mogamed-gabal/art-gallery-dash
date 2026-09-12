import { ContentApiService } from './content-api.service';
describe('ContentApiService', () => { it('exposes content read, update and upload contract', () => { expect(ContentApiService.prototype.getSiteInfo).toBeDefined(); expect(ContentApiService.prototype.updateSection).toBeDefined(); expect(ContentApiService.prototype.uploadImage).toBeDefined(); }); });
