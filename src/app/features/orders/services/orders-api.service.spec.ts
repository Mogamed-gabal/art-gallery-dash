import { OrdersApiService } from './orders-api.service';
describe('OrdersApiService', () => { it('exposes order read and status contract', () => { expect(OrdersApiService.prototype.list).toBeDefined(); expect(OrdersApiService.prototype.getById).toBeDefined(); expect(OrdersApiService.prototype.updateStatus).toBeDefined(); }); });
