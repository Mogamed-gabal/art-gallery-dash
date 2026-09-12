import { NotificationService } from './notification.service';
describe('NotificationService', () => { it('stores a message and its type', () => { const service = new NotificationService(); service.success('تم الحفظ'); expect(service.message()).toBe('تم الحفظ'); expect(service.type()).toBe('success'); }); });
