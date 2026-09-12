import { ArtworksApiService } from './artworks-api.service';
describe('ArtworksApiService', () => { it('exposes artwork CRUD contract', () => { expect(ArtworksApiService.prototype.list).toBeDefined(); expect(ArtworksApiService.prototype.create).toBeDefined(); expect(ArtworksApiService.prototype.update).toBeDefined(); expect(ArtworksApiService.prototype.remove).toBeDefined(); }); });
